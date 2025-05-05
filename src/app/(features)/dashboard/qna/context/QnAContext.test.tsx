import { render, act } from "@testing-library/react";
import { QnAProvider, useQnA } from "./QnAContext";
import { askQuestionAction } from "../actions/qnaActions";
import { Severity } from "@/context/SnackbarContext";

jest.mock("../actions/qnaActions", () => ({
  askQuestionAction: jest.fn(),
}));

jest.mock("@/context/SnackbarContext", () => ({
  useSnackbar: () => ({
    showSnackbar: jest.fn(),
  }),
  Severity: {
    ERROR: "error",
  },
}));

const TestComponent = () => {
  const { loading, response, ask } = useQnA();
  return (
    <div>
      <p data-testid="loading">{loading ? "Loading" : "Not Loading"}</p>
      <p data-testid="response">{response ? response.answer : "No Response"}</p>
      <button
        data-testid="ask-button"
        onClick={() => ask("What is the meaning of life?")}
      >
        Ask
      </button>
    </div>
  );
};

describe("QnAContext", () => {
  it("should provide default values", () => {
    const { getByTestId } = render(
      <QnAProvider>
        <TestComponent />
      </QnAProvider>
    );

    expect(getByTestId("loading").textContent).toBe("Not Loading");
    expect(getByTestId("response").textContent).toBe("No Response");
  });

  it("should handle successful ask action", async () => {
    (askQuestionAction as jest.Mock).mockResolvedValueOnce({
      answer: "42",
    });

    const { getByTestId } = render(
      <QnAProvider>
        <TestComponent />
      </QnAProvider>
    );

    const button = getByTestId("ask-button");

    await act(async () => {
      button.click();
    });

    expect(getByTestId("loading").textContent).toBe("Not Loading");
    expect(getByTestId("response").textContent).toBe("42");
  });

  it("should handle failed ask action", async () => {
    const showSnackbar = jest.fn();
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("@/context/SnackbarContext"), "useSnackbar")
      .mockReturnValue({ showSnackbar });

    (askQuestionAction as jest.Mock).mockResolvedValueOnce(null);

    const { getByTestId } = render(
      <QnAProvider>
        <TestComponent />
      </QnAProvider>
    );

    const button = getByTestId("ask-button");

    await act(async () => {
      button.click();
    });

    expect(getByTestId("loading").textContent).toBe("Not Loading");
    expect(getByTestId("response").textContent).toBe("No Response");
    expect(showSnackbar).toHaveBeenCalledWith(
      Severity.ERROR,
      "Something went wrong"
    );
  });

  it("should handle errors during ask action", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    (askQuestionAction as jest.Mock).mockRejectedValueOnce(
      new Error("Network Error")
    );

    const { getByTestId } = render(
      <QnAProvider>
        <TestComponent />
      </QnAProvider>
    );

    const button = getByTestId("ask-button");

    await act(async () => {
      button.click();
    });

    expect(getByTestId("loading").textContent).toBe("Not Loading");
    expect(getByTestId("response").textContent).toBe("No Response");
    expect(consoleSpy).toHaveBeenCalledWith("CATCHED ERROR:", {
      error: new Error("Network Error"),
    });

    consoleSpy.mockRestore();
  });
});
