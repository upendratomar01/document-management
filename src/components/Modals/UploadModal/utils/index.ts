import { UploadingFile } from "../types";

export const MAX_FILES = 2;
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

export function getUniqueFileName(
  existingFiles: UploadingFile[],
  newFiles: UploadingFile[]
) {
  const uniqueFiles: UploadingFile[] = [];

  newFiles.forEach((newFile) => {
    const isDuplicate = existingFiles.some(
      (existingFile) => existingFile.file.name === newFile.file.name
    );
    if (!isDuplicate) {
      uniqueFiles.push(newFile);
    }
  });

  return uniqueFiles;
}
