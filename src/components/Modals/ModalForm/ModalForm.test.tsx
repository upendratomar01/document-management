import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ModalForm } from "./index";

describe("ModalForm Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn(async () => {});

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    title: "Test Modal",
    initialValues: { name: "" },
    validationSchema: undefined,
    onSubmit: mockOnSubmit,
    children: <input name="name" placeholder="Name" />,
    submitLabel: "Submit",
    cancelLabel: "Cancel",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the modal with the correct title and buttons", () => {
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("calls onClose when the cancel button is clicked", () => {
    render(<ModalForm {...defaultProps} />);

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("calls onSubmit when the form is submitted", async () => {
    render(<ModalForm {...defaultProps} />);

    const submitButton = screen.getByText("Submit");
    fireEvent.click(submitButton);

    waitFor(() => expect(mockOnSubmit).toHaveBeenCalledTimes(1));
  });

  it("disables buttons while submitting", () => {
    render(
      <ModalForm
        {...defaultProps}
        onSubmit={async () => {
          // Simulate a delay
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }}
      />
    );

    const submitButton = screen.getByText("Submit");
    const cancelButton = screen.getByText("Cancel");

    fireEvent.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
  });

  it("renders children correctly", () => {
    render(<ModalForm {...defaultProps} />);

    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
  });
});
