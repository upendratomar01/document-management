import { render, screen } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ProtectedRoute from "./ProtectedRoute";
import { ROUTES } from "@/constants/routes";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/components/Loader", () => jest.fn(() => <div>Loading...</div>));

describe("ProtectedRoute", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders the children when the session status is authenticated", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "authenticated" });
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects to the sign-in page if the session status is unauthenticated", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    (usePathname as jest.Mock).mockReturnValue("/dashboard");

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(signOut).toHaveBeenCalledWith({ redirect: false });
    expect(mockPush).toHaveBeenCalledWith(ROUTES.SIGNIN);
  });

  it("does not redirect if the user is on the sign-in page", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "unauthenticated" });
    (usePathname as jest.Mock).mockReturnValue(ROUTES.SIGNIN);

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(signOut).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("renders the Loader component when the session status is loading", () => {
    (useSession as jest.Mock).mockReturnValue({ status: "loading" });

    render(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });
});
