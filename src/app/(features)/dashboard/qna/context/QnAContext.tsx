"use client";

import { createContext, useContext, useState } from "react";

const QnAContext = createContext<QnAContextType | undefined>(undefined);

import { QnAContextType, QnaResponse } from "../types";
import { askQuestionAction } from "../actions/qnaActions";
import { Severity, useSnackbar } from "@/context/SnackbarContext";

export const QnAProvider = ({ children }: { children: React.ReactNode }) => {
  const [response, setResponse] = useState<QnaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const ask = async (question: string) => {
    setLoading(true);
    try {
      const res = await askQuestionAction({ question });
      if (res) {
        setResponse(res);
      } else {
        showSnackbar(Severity.ERROR, "Something went wrong");
      }
    } catch (error) {
      console.log("CATCHED ERROR:", { error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <QnAContext.Provider value={{ loading, response, ask }}>
      {children}
    </QnAContext.Provider>
  );
};

export const useQnA = () => {
  const context = useContext(QnAContext);
  if (!context) throw new Error("useQnA must be used within QnAProvider");
  return context;
};
