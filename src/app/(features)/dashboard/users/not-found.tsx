import ErrorComponent from "@/components/ErrorComponent";
import React from "react";

export default function UsersNotFoundPage() {
  return (
    <ErrorComponent title="Not Found" description="Documents not found." />
  );
}
