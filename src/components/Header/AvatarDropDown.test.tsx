import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signOut, useSession } from "next-auth/react";
import AvatarDropDown from "./AvatarDropDown";
import { ROUTES } from "@/constants/routes";

jest.mock("next-auth/react", () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe("AvatarDropDown", () => {
  it("renders the AvatarDropDown component when session exists", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "John Doe" } },
    });

    render(<AvatarDropDown />);

    const avatarButton = screen.getByRole("button");
    expect(avatarButton).toBeInTheDocument();
    expect(screen.getByText("J")).toBeInTheDocument(); // First letter of "John Doe"
  });

  it("does not render the AvatarDropDown component when session does not exist", () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });

    const { container } = render(<AvatarDropDown />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens the menu when the avatar button is clicked", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "John Doe" } },
    });

    render(<AvatarDropDown />);

    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();
  });

  it("closes the menu when clicking outside or on a menu item", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "John Doe" } },
    });

    render(<AvatarDropDown />);

    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    const menu = screen.getByRole("menu");
    expect(menu).toBeInTheDocument();

    fireEvent.click(document.body); // Simulate clicking outside
    waitFor(() => expect(menu).not.toBeInTheDocument());
  });

  it("calls signOut with the correct parameters when logout is clicked", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { name: "John Doe" } },
    });

    render(<AvatarDropDown />);

    const avatarButton = screen.getByRole("button");
    fireEvent.click(avatarButton);

    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: ROUTES.SIGNIN,
    });
  });
});
