import React from "react";
import { Alert, Box, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { UploadMessage } from "./types";

interface FileStatusProps {
  file: File;
  message?: UploadMessage;
}

const FileStatus: React.FC<FileStatusProps> = ({ file, message }) => {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        {file.type.includes("image") ? (
          <ImageIcon fontSize="large" color="warning" />
        ) : (
          <InsertDriveFileIcon fontSize="large" color="primary" />
        )}
        <Box
          sx={{
            width: "100%",
            overflow: "hidden",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {(file.size / 1024).toFixed(2)} KB
          </Typography>
        </Box>
      </Box>

      {message && (
        <Alert severity={message?.type} sx={{ mt: 1 }}>
          {message?.text}
        </Alert>
      )}
    </>
  );
};

export default FileStatus;
