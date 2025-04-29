export type Doc = {
  id: string;
  name: string;
  type: string;
  size: number;
  path: string;
};

export type ClientTableProps = {
  initialDocs: Doc[];
};
