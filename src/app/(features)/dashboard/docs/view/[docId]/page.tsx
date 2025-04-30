import React from "react";
import { ClientViewer } from "./components/ClientView";
import { getDocByIdAction } from "../../actions/docActions";
import { INGESTION_STATUS } from "@/constants/routes";
import { notFound } from "next/navigation";

export default async function ViewDocPage({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const docId = (await params).docId;
  const doc = await getDocByIdAction(docId);

  if (!doc) notFound();

  const transformedDocs = {
    ...doc,
    ingestionStatus: doc.ingestionStatus as unknown as INGESTION_STATUS,
  };

  return <ClientViewer doc={transformedDocs} />;
}
