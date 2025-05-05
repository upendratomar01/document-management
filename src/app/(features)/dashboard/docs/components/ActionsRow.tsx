import React from "react";
import { INGESTION_STATUS, ROUTES } from "@/constants/routes";
import { downloadFile } from "@lib/utils";
import { IconButton, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import DownloadIcon from "@mui/icons-material/Download";
import ReplayIcon from "@mui/icons-material/Replay";
import { useRole } from "@features/auth/hooks/useRole";
import { Doc } from "../types";

type ActionRowProps = {
  doc: Doc;
  onDelete: (id: string) => void;
  onRetry: (id: string) => void;
};
export default function ActionsRow({ doc, onDelete, onRetry }: ActionRowProps) {
  const { isAdmin } = useRole();
  const router = useRouter();

  const isDocx =
    doc.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isExcel =
    doc.type ===
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const showRetry =
    doc.ingestionStatus === INGESTION_STATUS.FAILED ||
    doc.ingestionStatus === INGESTION_STATUS.PENDING;

  return (
    <Stack spacing={3} direction="row">
      {!(isDocx || isExcel) && (
        <IconButton onClick={() => router.push(ROUTES.VIEW_DOC + doc.id)}>
          <VisibilityIcon color="primary" />
        </IconButton>
      )}
      <IconButton onClick={() => downloadFile(doc.path)}>
        <DownloadIcon color="success" />
      </IconButton>
      {showRetry && (
        <IconButton onClick={() => onRetry(doc.id)}>
          <ReplayIcon color="warning" />
        </IconButton>
      )}
      {isAdmin && (
        <IconButton onClick={() => onDelete(doc.id)}>
          <DeleteForeverIcon color="error" />
        </IconButton>
      )}
    </Stack>
  );
}
