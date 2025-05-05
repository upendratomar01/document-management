"use client";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import ImageViewer from "./ImageViewer";
import DocDetails from "./DocDetails";
import { Doc } from "@features/dashboard/docs/types";

type ClientViewProps = {
  doc: Doc;
};

export const ClientViewer = ({ doc }: ClientViewProps) => {
  const { type, name, path: url } = doc;
  const [loading, setLoading] = useState(true);
  const isImage = doc.type.startsWith("image/");
  const isPdf = doc.type === "application/pdf";

  return (
    <Box p={4}>
      <DocDetails doc={doc} />
      {isPdf && (
        <iframe
          src={url}
          width="100%"
          height="600px"
          style={{ border: "none" }}
          onLoad={() => setLoading(false)}
        />
      )}

      {isImage && <ImageViewer url={url} alt={name} />}

      {!loading && !isImage && !isPdf && (
        <Typography color="error">Unsupported file type: {type}</Typography>
      )}
    </Box>
  );
};
