import { INGESTION_STATUS } from "@/constants/routes";
import { triggerIngestionAction } from "../actions/docActions";
import { Doc } from "../types";
import { signOut } from "next-auth/react";
import { Severity, useSnackbar } from "@/context/SnackbarContext";

export function useIngestionStatus(
  setDocs: React.Dispatch<React.SetStateAction<Doc[]>>
) {
  const { showSnackbar } = useSnackbar();

  const listenToIngestionStatus = (
    docId: string,
    onUpdate: (status: INGESTION_STATUS) => void
  ) => {
    const eventSource = new EventSource(`/api/ingest-status/${docId}`);

    eventSource.onmessage = (event) => {
      onUpdate(event.data as INGESTION_STATUS);
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => eventSource.close();
  };

  async function handleIngest(id: string) {
    try {
      const res = await triggerIngestionAction(id);
      if (res?.status === 401) {
        signOut({ redirect: true });
      } else if (res?.success) {
        listenToIngestionStatus(id, (status) => {
          setDocs((prevDocs) =>
            prevDocs.map((doc) =>
              doc.id === id
                ? { ...doc, ingestionStatus: status as INGESTION_STATUS }
                : doc
            )
          );
        });
      } else if (res?.error) {
        showSnackbar(
          Severity.ERROR,
          res.error ?? "Failed to ingest the document."
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  return handleIngest;
}
