export type QnaRequest = {
  question: string;
};

export type QnaResponse = {
  answer: string;
  excerpts: string[];
  status: "pending" | "in_progress" | "complete" | "failed";
};

export type QnAContextType = {
  loading: boolean;
  response: QnaResponse | null;
  ask: (question: string) => void;
};
