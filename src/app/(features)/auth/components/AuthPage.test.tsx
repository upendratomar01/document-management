import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthPage from "./AuthPage";
import { ROUTES } from "@/constants/routes";
import { loginUser, registerUser } from "../services/authApi";
import { useRouter } from "next/navigation";

jest.mock("../services/authApi", () => ({
  loginUser: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("AuthPage", () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("renders the login form when isLogin is true", () => {
    render(<AuthPage isLogin={true} />);

    expect(screen.getAllByText("Sign in")[0]).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.queryByLabelText("Full name")).not.toBeInTheDocument();
  });

  it("renders the signup form when isLogin is false", () => {
    render(<AuthPage isLogin={false} />);

    expect(screen.getAllByText("Sign up")[0]).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<AuthPage isLogin={true} />);

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Password is required.")).toBeInTheDocument();
    });
  });

  it("calls loginUser and redirects on successful login", async () => {
    (loginUser as jest.Mock).mockResolvedValue({ ok: true });

    render(<AuthPage isLogin={true} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockPush).toHaveBeenCalledWith(ROUTES.HOME);
    });
  });

  it("shows error alert on failed login", async () => {
    (loginUser as jest.Mock).mockResolvedValue({
      error: "Invalid credentials",
    });

    render(<AuthPage isLogin={true} />);

    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText("Password"), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("calls registerUser and shows success alert on successful signup", async () => {
    (registerUser as jest.Mock).mockResolvedValue({ ok: true });

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
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(registerUser).toHaveBeenCalledWith({
        name: "John Doe",
        email: "test@example.com",
        password: "password123",
        allowExtraEmails: false,
      });
      expect(
        screen.getByText("Signup successful! Please login."),
      ).toBeInTheDocument();
    });
  });

  it("shows error alert on failed signup", async () => {
    (registerUser as jest.Mock).mockResolvedValue({
      error: "Email already exists",
    });

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
    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    await waitFor(() => {
      expect(screen.getByText("Email already exists")).toBeInTheDocument();
    });
  });
});
