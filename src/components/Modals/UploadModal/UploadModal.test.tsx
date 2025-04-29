import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { UploadModal } from "./index";
import { UploadingFile, UploadModalProps } from "./types";
import { DropzoneInputProps, DropzoneRootProps } from "react-dropzone";

const mockProps: UploadModalProps = {
  open: true,
  isUploading: false,
  isUploadingDone: false,
  files: [],
  isDragActive: false,
  onClose: jest.fn(),
  onUpload: jest.fn(),
  handleRemoveFile: jest.fn(),
  getRootProps: jest.fn(<T extends DropzoneRootProps>(props?: T): T => {
    return {
      ...props,
      onClick: () => {},
      onKeyDown: () => {},
      role: "presentation",
      tabIndex: 0,
    } as unknown as T;
  }),
  getInputProps: jest.fn(<T extends DropzoneInputProps>(props?: T): T => {
    return { ...props } as T;
  }),
};

describe("UploadModal Component", () => {
  it("renders the modal when open is true", () => {
    render(<UploadModal {...mockProps} />);
    expect(screen.getByText("Upload Document")).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", () => {
    render(<UploadModal {...mockProps} />);
    const closeButton = screen.getByLabelText("close");
    fireEvent.click(closeButton);
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  it("displays the correct drag-and-drop message when isDragActive is true", () => {
    render(<UploadModal {...mockProps} isDragActive={true} />);
    expect(screen.getByText("Drop the files here ...")).toBeInTheDocument();
  });

  it("displays the default drag-and-drop UI when isDragActive is false", () => {
    render(<UploadModal {...mockProps} />);
    expect(
      screen.getByText("Drag your files to start uplaoding")
    ).toBeInTheDocument();
    expect(screen.getByText("OR")).toBeInTheDocument();
    expect(screen.getByText("Browse Files")).toBeInTheDocument();
  });

  it("disables the upload button when no files are present", () => {
    render(<UploadModal {...mockProps} />);
    const uploadButton = screen.getByText("Upload");
    expect(uploadButton).toBeDisabled();
  });

  it("enables the upload button when files are present and not uploading", () => {
    render(
      <UploadModal
        {...mockProps}
        files={[{ file: new File(["test"], "test.txt"), progress: 0 }]}
      />
    );
    const uploadButton = screen.getByText("Upload");
    expect(uploadButton).not.toBeDisabled();
  });

  it("calls onUpload when the upload button is clicked", () => {
    render(
      <UploadModal
        {...mockProps}
        files={[{ file: new File(["test"], "test.txt"), progress: 0 }]}
      />
    );
    const uploadButton = screen.getByText("Upload");
    fireEvent.click(uploadButton);
    expect(mockProps.onUpload).toHaveBeenCalled();
  });

  it("renders the file list when files are provided", () => {
    const files: UploadingFile[] = [
      { file: new File(["test1"], "test1.txt"), progress: 50 },
      {
        file: new File(["test2"], "test2.txt"),
        progress: 100,
      },
    ];
    render(<UploadModal {...mockProps} files={files} />);
    expect(screen.getByText("test1.txt")).toBeInTheDocument();
    expect(screen.getByText("test2.txt")).toBeInTheDocument();
  });

  it("calls handleRemoveFile when a file is removed", () => {
    const files: UploadingFile[] = [
      { file: new File(["test1"], "test1.txt"), progress: 50 },
    ];
    render(<UploadModal {...mockProps} files={files} />);
    const removeButton = screen.getByText("test1.txt");

    fireEvent.click(removeButton!);
    waitFor(() => expect(mockProps.handleRemoveFile).toHaveBeenCalled());
  });
});
