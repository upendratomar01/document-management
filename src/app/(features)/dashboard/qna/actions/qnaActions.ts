"use server";

import { QnaRequest, QnaResponse } from "../types";

export const askQuestionAction = async (
  data: QnaRequest
): Promise<QnaResponse | null> => {
  try {
    const qna: QnaResponse = await new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          answer: `This is a mock answer to: "${data.question}"`,
          excerpts: ["Document Excerpt 1", "Document Excerpt 2"],
          status: "complete",
        });
      }, 2000); // simulate delay
    });
    return qna;
  } catch (error) {
    console.log("CATCHED ERROR----", error);
    return null;
  }
};
