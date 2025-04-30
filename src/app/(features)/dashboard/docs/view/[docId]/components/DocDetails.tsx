import { formatISODate } from "@lib/utils";
import { Stack, Typography } from "@mui/material";
import React from "react";
import { Doc } from "@features/dashboard/docs/types";

type DocDetailsProps = {
  doc: Doc;
};

export default function DocDetails({ doc }: DocDetailsProps) {
  const { type, name, size, createdAt } = doc;
  return (
    <Stack>
      {name && (
        <Typography variant="subtitle2">
          <strong>Name:</strong> {name}
        </Typography>
      )}
      {type && (
        <Typography variant="subtitle2">
          <strong>Type:</strong> {type}
        </Typography>
      )}
      {size && (
        <Typography variant="subtitle2">
          <strong>Size:</strong> {(size / 1024).toFixed(2)} KB
        </Typography>
      )}
      {createdAt && (
        <Typography variant="subtitle2">
          <strong>Created At:</strong> {formatISODate(createdAt.toString())}
        </Typography>
      )}
    </Stack>
  );
}
