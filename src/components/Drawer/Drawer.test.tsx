import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Drawer from "./index";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("./DrawerItem", () => ({
  DrawerItem: ({ text, onClick }: { text: string; onClick: () => void }) => (
    <div data-testid={`drawer-item-${text}`} onClick={onClick}>
      {text}
    </div>
  ),
}));

describe("Drawer Component", () => {
  const mockPush = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it("should render the Drawer component when open", () => {
    render(<Drawer open={true} onClose={mockOnClose} />);

    expect(screen.getByTestId("drawer-item-Users")).toBeInTheDocument();
    expect(screen.getByTestId("drawer-item-Documents")).toBeInTheDocument();
  });

  it("should call onClose when the close button is clicked", () => {
    render(<Drawer open={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should navigate to Users route when Users item is clicked", () => {
    render(<Drawer open={true} onClose={mockOnClose} />);

    const usersItem = screen.getByTestId("drawer-item-Users");
    fireEvent.click(usersItem);

    expect(mockPush).toHaveBeenCalledWith(ROUTES.DASHBOARD_USERS);
  });

  it("should navigate to Documents route when Documents item is clicked", () => {
    render(<Drawer open={true} onClose={mockOnClose} />);

    const documentsItem = screen.getByTestId("drawer-item-Documents");
    fireEvent.click(documentsItem);

    expect(mockPush).toHaveBeenCalledWith(ROUTES.DASHBOARD_DOCS);
  });

  it("should not render Drawer items when closed", () => {
    render(<Drawer open={false} onClose={mockOnClose} />);

    expect(screen.queryByTestId("drawer-item-Users")).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("drawer-item-Documents")
    ).not.toBeInTheDocument();
  });
});
