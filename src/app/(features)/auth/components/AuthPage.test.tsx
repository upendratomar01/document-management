import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AuthPage from "./AuthPage";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/router";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/constants/routes", () => ({
  ROUTES: {
    SIGNIN: "/auth/signin",
    SIGNUP: "/auth/signup",
  },
}));

describe("AuthPage", () => {
  const mockSignin = jest.fn();
  const mockSignup = jest.fn();
  const mockPush = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      signin: mockSignin,
      signup: mockSignup,
    });

    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders sign-in form when isLogin is true", () => {
    render(<AuthPage isLogin={true} />);

    expect(screen.getAllByText("Sign in")[0]).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
  });

  it("renders sign-up form when isLogin is false", () => {
    render(<AuthPage isLogin={false} />);

    expect(screen.getAllByText("Sign up")[0]).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  });

  it("validates form inputs and shows errors", async () => {
    render(<AuthPage isLogin={false} />);

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(screen.getByText("Name is required.")).toBeInTheDocument();
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });
  });

  it("calls signin function on valid sign-in form submission", async () => {
    render(<AuthPage isLogin={true} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockSignin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  it("calls signup function on valid sign-up form submission", async () => {
    render(<AuthPage isLogin={false} />);

    fireEvent.change(screen.getByLabelText("Full name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
        allowExtraEmails: false,
      });
    });
  });

  it("renders the correct link to switch between login and signup", () => {
    render(<AuthPage isLogin={true} />);

    expect(screen.getByText("Sign up").closest("a")).toHaveAttribute(
      "href",
      ROUTES.SIGNUP
    );
  });
});
