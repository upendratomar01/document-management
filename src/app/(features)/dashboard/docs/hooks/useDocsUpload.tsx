import {
  UploadingFile,
  UploadMessage,
} from "@/components/Modals/UploadModal/types";
import {
  MAX_FILES,
  MAX_FILE_SIZE,
  ALLOWED_FILE_TYPES,
  getUniqueFileName,
} from "@/components/Modals/UploadModal/utils";
import { axiosInstance } from "@lib/axiosInstance";
import React from "react";
import { useDropzone } from "react-dropzone";
import { Doc } from "../types";
import { signOut } from "next-auth/react";

export default function useUploadModal() {
  const [files, setFiles] = React.useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isUploadingDone, setIsUploadingDone] = React.useState(false);
  const [uploadedDocs, setUploadedDocs] = React.useState<Doc[]>([]);

  // Helper function to handle file validation and addition
  const processFiles = (newFiles: File[]) => {
    const selectedFiles = newFiles.map((file) => ({
      file,
      progress: 0,
    }));

    if (selectedFiles.length > MAX_FILES) {
      alert(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    const invalidFiles = selectedFiles.filter(
      (file) =>
        file.file.size > MAX_FILE_SIZE ||
        !ALLOWED_FILE_TYPES.includes(file.file.type)
    );
    if (invalidFiles.length > 0) {
      alert(
        `Invalid files: ${invalidFiles
          .map((file) => file.file.name)
          .join(", ")}. Please select valid files.`
      );
      return;
    }

    const uniqueFiles = getUniqueFileName(files, selectedFiles);
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles, ...uniqueFiles];
      if (newFiles.length > MAX_FILES) {
        return newFiles.slice(0, MAX_FILES);
      }
      return newFiles;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
    onDrop: (acceptedFiles) => {
      processFiles(acceptedFiles);
    },
  });

  const handleClose = () => {
    setFiles([]);
    setIsUploadingDone(false);
  };

  const handleRemoveFile = (file: File) => {
    setFiles((prevFiles) => prevFiles.filter((f) => f.file.name !== file.name));
  };

  const setFileUploadingStatus = (
    file: File,
    progress: number,
    message?: UploadMessage
  ) => {
    setFiles((prev) =>
      prev.map((u) =>
        u.file.name === file.name
          ? {
              ...u,
              progress,
              message,
            }
          : u
      )
    );
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true); //  disable button
    try {
      const uploadPromises = files.map(async (fileData) => {
        const file = fileData.file;
        const formData = new FormData();
        formData.append("file", file);

        const successMessage: UploadMessage = {
          type: "success",
          text: "File uploaded successfully",
        };

        try {
          const response = await axiosInstance.post("/api/docs", formData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                setFileUploadingStatus(file, progress);
              }
            },
          });

          if (response.data.success) {
            setFileUploadingStatus(file, 100, successMessage);
            setUploadedDocs((prev) => {
              const newDoc = response.data.data;
              return [...prev, newDoc];
            });
          }
        } catch (error) {
          console.error("Error uploading file:", error);
          if ((error as any)?.status === 401) {
            signOut({ redirect: true });
          }
          const errorMessage: UploadMessage = {
            type: "error",
            text: (error as any)?.data.error || "File upload failed",
          };
          setFileUploadingStatus(file, 0, errorMessage);
        }
      });

      //  Wait for all uploads to finish (success or fail)
      const res = await Promise.allSettled(uploadPromises);
      console.log("Upload results:", res);
    } finally {
      setIsUploading(false); //  re-enable button
      setIsUploadingDone(true); //  close modal
    }
  };

  return {
    files,
    isDragActive,
    isUploading,
    isUploadingDone,
    uploadedDocs,
    getRootProps,
    getInputProps,
    handleClose,
    handleRemoveFile,
    handleUpload,
  };
}
