import { getUniqueFileName } from ".";
import { UploadingFile } from "../types";

const mockFile = (name: string): File =>
  new File(["file content"], name, { type: "application/pdf" });

describe("getUniqueFileName", () => {
  it("should return only unique files not present in existingFiles", () => {
    const existingFiles: UploadingFile[] = [
      { file: mockFile("existing1.pdf"), progress: 0 },
      { file: mockFile("existing2.pdf"), progress: 0 },
    ];

    const newFiles: UploadingFile[] = [
      { file: mockFile("existing1.pdf"), progress: 0 }, // duplicate
      { file: mockFile("new1.pdf"), progress: 0 }, // unique
      { file: mockFile("new2.pdf"), progress: 0 }, // unique
    ];

    const result = getUniqueFileName(existingFiles, newFiles);

    expect(result).toHaveLength(2);
    expect(result.map((f) => f.file.name)).toEqual(["new1.pdf", "new2.pdf"]);
  });

  it("should return all new files if none are duplicates", () => {
    const existingFiles: UploadingFile[] = [
      { file: mockFile("existing.pdf"), progress: 0 },
    ];

    const newFiles: UploadingFile[] = [
      { file: mockFile("new1.pdf"), progress: 0 },
      { file: mockFile("new2.pdf"), progress: 0 },
    ];

    const result = getUniqueFileName(existingFiles, newFiles);

    expect(result).toHaveLength(2);
    expect(result.map((f) => f.file.name)).toEqual(["new1.pdf", "new2.pdf"]);
  });

  it("should return an empty array if all new files are duplicates", () => {
    const existingFiles: UploadingFile[] = [
      { file: mockFile("same.pdf"), progress: 0 },
    ];

    const newFiles: UploadingFile[] = [
      { file: mockFile("same.pdf"), progress: 0 },
    ];

    const result = getUniqueFileName(existingFiles, newFiles);

    expect(result).toHaveLength(0);
  });

  it("should return all files if existingFiles is empty", () => {
    const existingFiles: UploadingFile[] = [];

    const newFiles: UploadingFile[] = [
      { file: mockFile("new1.pdf"), progress: 0 },
      { file: mockFile("new2.pdf"), progress: 0 },
    ];

    const result = getUniqueFileName(existingFiles, newFiles);

    expect(result).toHaveLength(2);
  });
});
