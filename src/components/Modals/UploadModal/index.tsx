import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FileStatusContainer } from "./FileStatusContainer";
import { UploadModalProps } from "./types";
import { MAX_FILES } from "./utils";

export function UploadModal({
  open,
  isUploading,
  isUploadingDone,
  files,
  isDragActive,
  onClose,
  onUpload,
  handleRemoveFile,
  getRootProps,
  getInputProps,
}: UploadModalProps) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogContent>
        <Box>
          <Typography variant="h6" gutterBottom>
            Upload Document
          </Typography>
          <Typography variant="body1" gutterBottom>
            Upload your document here. You can uplaod up to {MAX_FILES} files at
            a time. The maximum file size is 10MB.
          </Typography>
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          style={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogContent>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: "0.125rem dashed #ccc",
            p: 15,
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            borderRadius: "4px",
            padding: "20px",
            backgroundColor: isDragActive ? "#f0f0f0" : "#fff",
          }}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <Typography>Drop the files here ...</Typography>
          ) : (
            <>
              <CloudUploadIcon fontSize="large" color="primary" />
              <Typography variant="body2">
                Drag your files to start uplaoding
              </Typography>
              <Divider sx={{ width: "100%", my: "0.5rem" }}>OR</Divider>
              <Button variant="outlined" color="primary">
                Browse Files
              </Button>
            </>
          )}
        </Box>

        <Typography variant="body2" sx={{ mt: 2 }}>
          You can upload files in the following formats: .jpg, .jpeg, .png,
          .pdf, .docx, .xlsx
        </Typography>
      </DialogContent>
      <DialogContent>
        <Grid container spacing={1} sx={{ maxHeight: "12.5rem" }}>
          {files.map(({ file, progress, message }) => (
            <Grid
              key={file.name}
              size={{
                xs: 12,
                sm: 6,
              }}
            >
              <FileStatusContainer
                progress={progress}
                file={file}
                message={message}
                onRemove={handleRemoveFile}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end" }}>
        <Button variant="outlined" color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="primary"
          disabled={isUploading || files.length === 0 || isUploadingDone}
          onClick={onUpload}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
}
