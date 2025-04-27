"use client";

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { ModalForm } from "@/components/ModalForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import { updateUserAction, deleteUserAction } from "@/lib/actions/userActions";
import { Severity, useSnackbar } from "@/context/SnackbarContext";
import { ROLES } from "@/constants/routes";
import { FormikTextField } from "@/components/FormikTextField";
import { FormikSelect } from "@/components/FormikSelect";
import { editUserValidationSchema } from "../utils";
import { UserType } from "../types";
import { useRole } from "@features/auth/hooks/useRole";

type UserFormValues = {
  name: string;
  email: string;
  role: ROLES;
};

const rolesOptions = [
  { label: ROLES.USER, value: ROLES.USER },
  { label: ROLES.ADMIN, value: ROLES.ADMIN },
];

export default function ClientTable({
  initialUsers,
}: {
  initialUsers: UserType[];
}) {
  const { showSnackbar } = useSnackbar();
  const { isAdmin } = useRole();
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [openDelete, setOpenDelete] = useState(false);

  const handleEdit = (user: UserType) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleDelete = (user: UserType) => {
    setSelectedUser(user);
    setOpenDelete(true);
  };

  const onEditSubmit = async (values: UserFormValues) => {
    try {
      if (!selectedUser) return;
      await updateUserAction({ id: selectedUser.id, ...values });
      showSnackbar(Severity.SUCCESS, "User updated successfully!");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id ? { ...user, ...values } : user,
        ),
      );
    } catch {
      showSnackbar(Severity.ERROR, "Failed to update user.");
    } finally {
      setOpenEdit(false);
    }
  };

  const onDeleteConfirm = async () => {
    try {
      if (!selectedUser) return;
      await deleteUserAction(selectedUser.id);
      showSnackbar(Severity.SUCCESS, "User deleted successfully!");
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== selectedUser?.id),
      );
    } catch {
      showSnackbar(Severity.ERROR, "Failed to delete user.");
    } finally {
      setOpenDelete(false);
    }
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 180 },
    { field: "name", headerName: "Name", minWidth: 200, flex: 1 },
    { field: "email", headerName: "Email", minWidth: 250, flex: 1 },
    { field: "role", headerName: "Role", minWidth: 150, flex: 0.5 },
    // ADD ACTIONS COLUIMN ONLY FOR ADMINS
    ...(isAdmin
      ? [
          {
            field: "actions",
            headerName: "Actions",
            minWidth: 200,
            renderCell: (params: GridRenderCellParams) => (
              <>
                <Button onClick={() => handleEdit(params.row)}>Edit</Button>
                <Button onClick={() => handleDelete(params.row)} color="error">
                  Delete
                </Button>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <Box style={{ height: 631, width: "100%" }}>
      <DataGrid
        rows={users}
        columns={columns}
        getRowId={(row) => row.id}
        autoPageSize
        // pageSizeOptions={[5, 10, 20]}
      />
      {/* Edit user role modal */}
      {openEdit && selectedUser && (
        <ModalForm<UserFormValues>
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          initialValues={selectedUser}
          validationSchema={editUserValidationSchema}
          onSubmit={onEditSubmit}
          title="Edit user details"
        >
          <FormikTextField name="name" label="Name" disabled />
          <FormikTextField name="email" label="Email" disabled />
          <FormikSelect name="role" label="Role" options={rolesOptions} />
        </ModalForm>
      )}

      <ConfirmDialog
        open={openDelete}
        title="Confirm Delete"
        description="Are you sure you want to delete this user?"
        onCancel={() => setOpenDelete(false)}
        onConfirm={onDeleteConfirm}
      />
    </Box>
  );
}
