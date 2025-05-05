"use client";

import { Typography, Box } from "@mui/material";
import { useQnA } from "../context/QnAContext";
import Loader from "@/components/Loader";

export default function AnswerDisplay() {
  const { response, loading } = useQnA();

  if (loading) return <Loader />;
  if (!response) return null;

  return (
    <Box mt={4}>
      <Typography variant="h6">Answer:</Typography>
      <Typography>{response.answer}</Typography>

      <Typography mt={2} variant="subtitle1">
        Related Excerpts:
      </Typography>
      <ul>
        {response.excerpts.map((excerpt, idx) => (
          <li key={idx}>{excerpt}</li>
        ))}
      </ul>
    </Box>
  );
}
