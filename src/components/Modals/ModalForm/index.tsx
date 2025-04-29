"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import { Formik, Form, FormikValues } from "formik";
import { ModalFormProps } from "./types";

export function ModalForm<T extends FormikValues>({
  open,
  onClose,
  title,
  initialValues,
  validationSchema,
  onSubmit,
  children,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
}: ModalFormProps<T>) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {title && <DialogTitle>{title}</DialogTitle>}
      <Formik<T>
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, helpers) => {
          await onSubmit(values, helpers);
          onClose();
          helpers.resetForm();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <DialogContent dividers>
              <Box display="flex" flexDirection="column" gap={2}>
                {children}
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={onClose} disabled={isSubmitting}>
                {cancelLabel}
              </Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {submitLabel}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
