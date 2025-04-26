"use client";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { SessionProvider } from "next-auth/react";
import React from "react";

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <SessionProvider>
      <SnackbarProvider>{children}</SnackbarProvider>
    </SessionProvider>
  );
}
