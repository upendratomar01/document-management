"use client";

import ErrorComponent from "@/components/ErrorComponent";
import { useParams } from "next/navigation";
import React from "react";

export default function DocNotFoundPage() {
  const params = useParams();
  const docId = params?.docId;

  return (
    <ErrorComponent
      title="Not Found"
      description={`Documents with id: ${docId} not found.`}
    />
  );
}
