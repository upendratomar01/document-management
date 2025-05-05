"use client";
import { CircularProgress, Box } from "@mui/material";
export default function Loader() {
  return (
    <Box
      display="flex"
      position="fixed"
      left={0}
      right={0}
      top={0}
      bottom={0}
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress />
    </Box>
  );
}
