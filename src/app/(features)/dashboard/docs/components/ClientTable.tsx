"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { ConfirmDialog } from "@/components/ConfirmDialog";

import { Severity, useSnackbar } from "@/context/SnackbarContext";
import { UploadModal } from "@/components/Modals/UploadModal";
import { ClientTableProps, Doc } from "../types";
import useUploadModal from "../hooks/useDocsUpload";
import { deleteDocAction } from "../actions/docActions";
import { signOut } from "next-auth/react";

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
      setDocs((prevDocs) => [...prevDocs, ...uploadedDocs]);
    }
  }, [uploadedDocs]);

  const handleDelete = (id: string) => {
    setSelectedDocId(id);
    setOpenDelete(true);
  };

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
    { field: "id", headerName: "ID", width: 180 },
    { field: "name", headerName: "Name", width: 250 },
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "size",
      headerName: "Size",
      width: 150,
      renderCell: (params: GridRenderCellParams) =>
        `${(params.value / 1024).toFixed(2)} KB`,
    },
    { field: "path", headerName: "Path", width: 300 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => handleDelete(params.row.id)} color="error">
          Delete
        </Button>
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
        autoPageSize
        pageSizeOptions={[5, 10, 20]}
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
