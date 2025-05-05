import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ClientTable from "../components/ClientTable"; // Adjust path accordingly
import { SnackbarProvider } from "@/context/SnackbarContext";
import { Doc } from "../types";
import { INGESTION_STATUS } from "@/constants/routes";

// Mock the UploadModal and ConfirmDialog to simplify the test
jest.mock("@/components/Modals/UploadModal", () => ({
  UploadModal: () => <div data-testid="upload-modal" />,
}));
// jest.mock("@/components/ConfirmDialog", () => ({
//   ConfirmDialog: ({ onCancel, onConfirm }: any) => (
//     <div data-testid="confirm-dialog">
//       <button onClick={onCancel}>Cancel</button>
//       <button onClick={onConfirm}>Confirm</button>
//     </div>
//   ),
// }));

jest.mock("next-auth/react", () => ({
  signOut: jest.fn(),
  useSession: () => ({
    data: { user: { role: "ADMIN" } },
    status: "authenticated",
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    pathname: "/",
  }),
}));

jest.mock("../actions/docActions", () => ({
  deleteDocAction: jest.fn().mockResolvedValue({ success: true }),
}));

jest.mock("../hooks/useDocsUpload", () => () => ({
  files: [],
  isDragActive: false,
  isUploading: false,
  isUploadingDone: false,
  uploadedDocs: [],
  handleClose: jest.fn(),
  handleRemoveFile: jest.fn(),
  handleUpload: jest.fn(),
  getRootProps: jest.fn(() => ({})),
  getInputProps: jest.fn(() => ({})),
}));

const initialDocs: Doc[] = [
  {
    id: "1",
    name: "File 1",
    type: "pdf",
    size: 2048,
    path: "/files/file1.pdf",
    ingestionStatus: INGESTION_STATUS.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    name: "File 2",
    type: "docx",
    size: 1024,
    path: "/files/file2.docx",
    ingestionStatus: INGESTION_STATUS.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const renderWithProviders = (ui: React.ReactElement) =>
  render(<SnackbarProvider>{ui}</SnackbarProvider>);

describe("ClientTable", () => {
  it("renders documents in the table", () => {
    renderWithProviders(<ClientTable initialDocs={initialDocs} />);
    expect(screen.getByText("File 1")).toBeInTheDocument();
    expect(screen.getByText("File 2")).toBeInTheDocument();
  });

  it("opens confirm dialog on delete click and deletes the doc", async () => {
    renderWithProviders(<ClientTable initialDocs={initialDocs} />);

    // screen.debug(undefined, 999999);
    // Click the delete button
    const deleteButtons = screen.getAllByTestId(/DeleteForeverIcon/);
    fireEvent.click(deleteButtons[0]);

    // screen.debug(undefined, 9999999);
    // Confirm dialog appears
    expect(await screen.findByText("Confirm Delete")).toBeInTheDocument();

    // Click confirm
    fireEvent.click(screen.getByText("Confirm"));

    // Wait for deletion to complete
    await waitFor(() => {
      expect(screen.queryByText("File 1")).not.toBeInTheDocument();
    });
  });
});
