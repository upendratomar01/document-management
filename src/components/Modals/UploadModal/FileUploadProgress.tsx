import React from "react";
import { Box, Typography, LinearProgress, IconButton } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

interface FileUploadProgressProps {
  file: File;
  uploadProgress: number;
  handleRemoveFile: (file: File) => void;
}

const FileUploadProgress: React.FC<FileUploadProgressProps> = ({
  file,
  uploadProgress,
  handleRemoveFile,
}) => {
  const showProgresbar = uploadProgress !== 0;
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "2.5rem",
        }}
      >
        <Box
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            variant="body2"
            sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {file.name}
          </Typography>
          {showProgresbar && (
            <Typography variant="body2" color="textSecondary">
              {Math.round(uploadProgress)}%
            </Typography>
          )}
        </Box>
        <Box>
          <IconButton size="small" onClick={() => handleRemoveFile(file)}>
            <HighlightOffIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {showProgresbar && (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{
            mt: 0.5,
            "&.MuiLinearProgress-root": {
              outline: "none",
            },
          }}
        />
      )}
    </>
  );
};

export default FileUploadProgress;
