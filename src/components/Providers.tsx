"use client";
import { SnackbarProvider } from "@/context/SnackbarContext";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import React from "react";

type ProvidersProps = {
  session: Session | null;
  children: React.ReactNode;
};
export default function Providers({ children, session }: ProvidersProps) {
  return (
    <SessionProvider session={session}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </SessionProvider>
  );
}
