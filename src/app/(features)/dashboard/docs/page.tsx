import { INGESTION_STATUS, ROUTES } from "@/constants/routes";
import authOptions from "@lib/auth";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { getDocsAction } from "./actions/docActions";
import ClientTable from "./components/ClientTable";

export default async function DocsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.SIGNIN);

  const docs = await getDocsAction();

  if (!docs) notFound();

  const transformedDocs = docs.map((doc) => ({
    ...doc,
    ingestionStatus: doc.ingestionStatus as unknown as INGESTION_STATUS,
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <ClientTable initialDocs={transformedDocs} />
    </div>
  );
}
