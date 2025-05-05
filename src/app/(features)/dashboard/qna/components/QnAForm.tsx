"use client";

import { useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import { useQnA } from "../context/QnAContext";

export default function QnAForm() {
  const [question, setQuestion] = useState("");
  const { ask, loading } = useQnA();

  const handleSubmit = () => {
    if (question.trim()) ask(question);
  };

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      <TextField
        label="Ask a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit} disabled={loading}>
        Ask
      </Button>
    </Box>
  );
}
