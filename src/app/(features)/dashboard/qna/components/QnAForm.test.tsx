import { render, screen, fireEvent } from "@testing-library/react";
import QnAForm from "./QnAForm";
import { useQnA } from "../context/QnAContext";

jest.mock("../context/QnAContext");

describe("QnAForm", () => {
  const mockAsk = jest.fn();
  const mockUseQnA = useQnA as jest.Mock;

  beforeEach(() => {
    mockUseQnA.mockReturnValue({
      ask: mockAsk,
      loading: false,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with a text field and a button", () => {
    render(<QnAForm />);

    expect(screen.getByLabelText(/ask a question/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ask/i })).toBeInTheDocument();
  });

  it("updates the text field value when typing", () => {
    render(<QnAForm />);

    const textField = screen.getByLabelText(/ask a question/i);
    fireEvent.change(textField, { target: { value: "What is AI?" } });

    expect(textField).toHaveValue("What is AI?");
  });

  it("calls the ask function with the question when the button is clicked", () => {
    render(<QnAForm />);

    const textField = screen.getByLabelText(/ask a question/i);
    const button = screen.getByRole("button", { name: /ask/i });

    fireEvent.change(textField, { target: { value: "What is AI?" } });
    fireEvent.click(button);

    expect(mockAsk).toHaveBeenCalledWith("What is AI?");
  });

  it("does not call the ask function if the question is empty", () => {
    render(<QnAForm />);

    const button = screen.getByRole("button", { name: /ask/i });
    fireEvent.click(button);

    expect(mockAsk).not.toHaveBeenCalled();
  });

  it("disables the button when loading is true", () => {
    mockUseQnA.mockReturnValue({
      ask: mockAsk,
      loading: true,
    });

    render(<QnAForm />);

    const button = screen.getByRole("button", { name: /ask/i });
    expect(button).toBeDisabled();
  });
});
