import { render, screen } from "@testing-library/react";
import AnswerDisplay from "./AnswerDisplay";
import { useQnA } from "../context/QnAContext";

jest.mock("../context/QnAContext", () => ({
  useQnA: jest.fn(),
}));

jest.mock("@/components/Loader", () => {
  const MockLoader = () => <div data-testid="loader">Loading...</div>;
  MockLoader.displayName = "MockLoader";
  return MockLoader;
});

describe("AnswerDisplay", () => {
  it("renders the Loader component when loading is true", () => {
    (useQnA as jest.Mock).mockReturnValue({ loading: true, response: null });

    render(<AnswerDisplay />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders nothing when response is null and loading is false", () => {
    (useQnA as jest.Mock).mockReturnValue({ loading: false, response: null });

    const { container } = render(<AnswerDisplay />);

    expect(container.firstChild).toBeNull();
  });

  it("renders the answer and related excerpts when response is available", () => {
    const mockResponse = {
      answer: "This is the answer.",
      excerpts: ["Excerpt 1", "Excerpt 2"],
    };
    (useQnA as jest.Mock).mockReturnValue({
      loading: false,
      response: mockResponse,
    });

    render(<AnswerDisplay />);

    expect(screen.getByText("Answer:")).toBeInTheDocument();
    expect(screen.getByText(mockResponse.answer)).toBeInTheDocument();
    expect(screen.getByText("Related Excerpts:")).toBeInTheDocument();
    mockResponse.excerpts.forEach((excerpt) => {
      expect(screen.getByText(excerpt)).toBeInTheDocument();
    });
  });
});
