import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

export type UploadModalProps = {
  open: boolean;
  isUploading: boolean;
  isUploadingDone: boolean;
  files: UploadingFile[];
  isDragActive: boolean;
  onClose: () => void;
  onUpload: () => void;
  handleRemoveFile: (file: File) => void;
  getRootProps: <T extends DropzoneRootProps>(props?: T) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T;
};

export type UploadMessage = {
  type: "success" | "error";
  text: string;
};

export type UploadingFile = {
  file: File;
  progress: number;
  message?: UploadMessage;
};
