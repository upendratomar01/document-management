"use client";

import { Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

type ErrorComponentProps = {
  title?: string;
  description?: string;
};

export default function ErrorComponent({
  title = "Unauthorized",
  description = "You do not have permission to view this page.",
}: ErrorComponentProps) {
  const router = useRouter();

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      p={3}
    >
      <LockOutlinedIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
      <Typography variant="h4" gutterBottom color="error">
        {title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {description}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Go to Home
      </Button>
    </Box>
  );
}
