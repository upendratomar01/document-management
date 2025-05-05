// Drawer.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Drawer from ".";
import { useRouter, usePathname } from "next/navigation";
import { useRole } from "@features/auth/hooks/useRole";
import { ROUTES } from "@/constants/routes";

// Mocks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock("@features/auth/hooks/useRole", () => ({
  useRole: jest.fn(),
}));

jest.mock("./DrawerItem", () => ({
  DrawerItem: ({ text, selected, onClick }: any) => (
    <div
      data-testid={`drawer-item-${text}`}
      data-selected={selected}
      onClick={onClick}
    >
      {text}
    </div>
  ),
}));

describe("Drawer", () => {
  const mockPush = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders all items when admin", () => {
    (useRole as jest.Mock).mockReturnValue({ isAdmin: true });
    (usePathname as jest.Mock).mockReturnValue(ROUTES.DASHBOARD_USERS);

    render(<Drawer open={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("drawer-item-Users")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-item-Documents")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-item-Q & A")).toBeInTheDocument();

    expect(screen.getByTestId("drawer-item-Users")).toHaveAttribute(
      "data-selected",
      "true"
    );
  });

  it("does not render 'Users' when not admin", () => {
    (useRole as jest.Mock).mockReturnValue({ isAdmin: false });
    (usePathname as jest.Mock).mockReturnValue(ROUTES.DASHBOARD_DOCS);

    render(<Drawer open={true} onClose={mockOnClose} />);

    expect(screen.queryByTestId("drawer-item-Users")).toBeNull();
    expect(screen.getByTestId("drawer-item-Documents")).toBeInTheDocument();
  });

  it("calls router.push when item clicked", () => {
    (useRole as jest.Mock).mockReturnValue({ isAdmin: false });
    (usePathname as jest.Mock).mockReturnValue("");

    render(<Drawer open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByTestId("drawer-item-Documents"));
    expect(mockPush).toHaveBeenCalledWith(ROUTES.DASHBOARD_DOCS);
  });

  it("calls onClose when ChevronLeftIcon is clicked", () => {
    (useRole as jest.Mock).mockReturnValue({ isAdmin: false });
    (usePathname as jest.Mock).mockReturnValue("");

    render(<Drawer open={true} onClose={mockOnClose} />);

    fireEvent.click(screen.getByRole("button"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
