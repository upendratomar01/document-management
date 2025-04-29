import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClientTable from "./ClientTable";
import { ROLES } from "@/constants/routes";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { useRole } from "@features/auth/hooks/useRole";

// Mock the useRole hook to return admin access
jest.mock("@features/auth/hooks/useRole", () => ({
  useRole: jest.fn(),
}));

// Sample users
const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: ROLES.USER,
  },
  {
    id: "2",
    name: "Jane Admin",
    email: "jane@example.com",
    role: ROLES.ADMIN,
  },
];

describe("ClientTable", () => {
  beforeEach(() => {
    // Always return admin for this test
    (useRole as jest.Mock).mockReturnValue({ isAdmin: true });
  });

  function renderComponent() {
    render(
      <SnackbarProvider>
        <ClientTable initialUsers={mockUsers} />
      </SnackbarProvider>
    );
  }

  it("renders all user rows", async () => {
    renderComponent();

    // Wait for rows to appear
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Admin")).toBeInTheDocument();
    });
  });

  it("shows Edit and Delete buttons for each user if admin", async () => {
    renderComponent();

    await waitFor(() => {
      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");

      expect(editButtons.length).toBe(2);
      expect(deleteButtons.length).toBe(2);
    });
  });

  it("opens edit modal when Edit button is clicked", async () => {
    renderComponent();

    const editButtons = await screen.findAllByText("Edit");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Edit user details")).toBeInTheDocument();
      expect(screen.getByLabelText("Role")).toBeInTheDocument();
    });
  });

  it("opens delete dialog when Delete button is clicked", async () => {
    renderComponent();

    const deleteButtons = await screen.findAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Confirm Delete")).toBeInTheDocument();
      expect(
        screen.getByText("Are you sure you want to delete this user?")
      ).toBeInTheDocument();
    });
  });
});
