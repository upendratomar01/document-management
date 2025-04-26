// src/context/SnackbarContext.tsx

import React, { createContext, useState, useContext, ReactNode } from "react";
import { Snackbar, Alert } from "@mui/material";

export enum Severity {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}

interface SnackbarContextType {
  showSnackbar: (severity: Severity, message: string) => void;
}

// Create the Snackbar Context
const SnackbarContext = createContext<SnackbarContextType | undefined>(
  undefined,
);

// Snackbar Provider Component
export const SnackbarProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [severity, setSeverity] = useState<Severity>(Severity.SUCCESS);

  const showSnackbar = (sev: Severity, msg: string) => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}

      {/* Snackbar component to show alerts */}
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

// Custom hook to use snackbar context
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};
