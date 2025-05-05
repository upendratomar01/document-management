import { Container, Typography } from "@mui/material";
import AnswerDisplay from "./components/AnswerDisplay";
import QnAForm from "./components/QnAForm";
import { QnAProvider } from "./context/QnAContext";

export default function QnAPage() {
  return (
    <QnAProvider>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Ask Questions
        </Typography>
        <QnAForm />
        <AnswerDisplay />
      </Container>
    </QnAProvider>
  );
}
