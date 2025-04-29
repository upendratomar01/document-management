import { Box } from "@mui/material";
import FileStatus from "./FileStatus";
import FileUploadProgress from "./FileUploadProgress";
import React from "react";
import { UploadMessage } from "./types";

type FileStatusContainerProps = {
  file: File;
  progress: number;
  message?: UploadMessage;
  onRemove: (file: File) => void;
};
export function FileStatusContainer({
  file,
  progress,
  message,
  onRemove,
}: FileStatusContainerProps) {
  const showProgresbar = progress < 100 && progress >= 0 && !message;
  return (
    <Box
      sx={{
        border: "0.0625rem solid #ccc",
        p: 2,
        mb: 1,
        borderRadius: "0.5rem",
      }}
    >
      {showProgresbar ? (
        <FileUploadProgress
          file={file}
          uploadProgress={progress}
          handleRemoveFile={onRemove}
        />
      ) : (
        <FileStatus file={file} message={message} />
      )}
    </Box>
  );
}
