import { INGESTION_STATUS } from "@/constants/routes";

export type Doc = {
  id: string;
  type: string;
  name: string;
  path: string;
  ingestionStatus: INGESTION_STATUS;
  createdAt: Date;
  updatedAt: Date;
  size: number;
};

export type ClientTableProps = {
  initialDocs: Doc[];
};
