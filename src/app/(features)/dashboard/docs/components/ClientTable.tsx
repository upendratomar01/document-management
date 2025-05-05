"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Severity, useSnackbar } from "@/context/SnackbarContext";
import { UploadModal } from "@/components/Modals/UploadModal";
import { ClientTableProps, Doc } from "../types";
import useUploadModal from "../hooks/useDocsUpload";
import { deleteDocAction } from "../actions/docActions";
import { signOut } from "next-auth/react";
import ActionsRow from "./ActionsRow";
import { INGESTION_STATUS } from "@/constants/routes";
import { green, grey, red, yellow } from "@mui/material/colors";
import { useIngestionStatus } from "../hooks/useIngestionStatus";

export default function ClientTable({ initialDocs }: ClientTableProps) {
  const [docs, setDocs] = useState<Doc[]>(initialDocs);

  const { showSnackbar } = useSnackbar();
  const {
    files,
    isDragActive,
    isUploading,
    isUploadingDone,
    uploadedDocs,
    handleClose,
    handleRemoveFile,
    handleUpload,
    getRootProps,
    getInputProps,
  } = useUploadModal();

  const [openCreate, setOpenCreate] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState<string | null>();
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    if (uploadedDocs.length > 0) {
      setDocs((prev) => {
        const existing = new Set(prev.map((doc) => doc.id));
        const newDocs = uploadedDocs.filter((doc) => !existing.has(doc.id));
        return [...prev, ...newDocs];
      });
    }
  }, [uploadedDocs]);

  const handleDelete = (id: string) => {
    setSelectedDocId(id);
    setOpenDelete(true);
  };

  const onIngestionRetry = useIngestionStatus(setDocs);

  const onDeleteConfirm = async () => {
    if (!selectedDocId) return;
    const res = await deleteDocAction(selectedDocId);

    try {
      if (res?.status === 401) {
        signOut({ redirect: true });
      } else if (res?.success) {
        setDocs((prevDocs) =>
          prevDocs.filter((doc) => doc.id !== selectedDocId)
        );
        showSnackbar(Severity.SUCCESS, "Doc deleted successfully!");
      } else if (res?.error) {
        showSnackbar(Severity.ERROR, res.error ?? "Failed to delete document.");
      }
    } catch (error) {
      console.log("error=======", error);
    } finally {
      setOpenDelete(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 180, flex: 0.3 },
    { field: "name", headerName: "Name", minWidth: 250, flex: 1 },
    { field: "type", headerName: "Type", minWidth: 150, flex: 0.5 },
    {
      field: "size",
      headerName: "Size",
      minWidth: 150,
      flex: 0.2,
      renderCell: (params: GridRenderCellParams) =>
        `${(params.value / 1024).toFixed(2)} KB`,
    },
    { field: "path", headerName: "Path", minWidth: 300, flex: 1 },
    {
      field: "ingestionStatus",
      headerName: "Ingestion Status",
      minWidth: 200,
      flex: 0.5,
      renderCell: (params) => {
        const colorMap = {
          [INGESTION_STATUS.PENDING]: grey[200],
          [INGESTION_STATUS.IN_PROGRESS]: yellow[100],
          [INGESTION_STATUS.COMPLETED]: green[100],
          [INGESTION_STATUS.FAILED]: red[100],
        } as const;
        return (
          <Chip
            label={params.value}
            sx={{
              backgroundColor: colorMap[params.value as INGESTION_STATUS],
            }}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 200,
      align: "right",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => (
        <ActionsRow
          doc={params.row}
          onDelete={handleDelete}
          onRetry={onIngestionRetry}
        />
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box className="flex justify-end">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Add Doc
        </Button>
      </Box>

      <DataGrid
        sx={{ mt: 2 }}
        rows={docs}
        columns={columns}
        getRowId={(row) => row.id}
        pageSizeOptions={[10, 25, 50, 100]}
        disableRowSelectionOnClick
      />

      <UploadModal
        open={openCreate}
        files={files}
        isDragActive={isDragActive}
        handleRemoveFile={handleRemoveFile}
        getRootProps={getRootProps}
        getInputProps={getInputProps}
        onUpload={handleUpload}
        isUploading={isUploading}
        isUploadingDone={isUploadingDone}
        onClose={() => {
          handleClose();
          setOpenCreate(false);
        }}
      />

      <ConfirmDialog
        open={openDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this document?"
        onCancel={() => setOpenDelete(false)}
        onConfirm={onDeleteConfirm}
      />
    </Box>
  );
}
