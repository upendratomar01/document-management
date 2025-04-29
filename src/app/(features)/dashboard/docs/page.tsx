import { ROUTES } from "@/constants/routes";
import authOptions from "@lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getDocs } from "./actions/docActions";
import ClientTable from "./components/ClientTable";

export default async function DocsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.SIGNIN);

  const docs = await getDocs();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>
      <ClientTable initialDocs={docs} />
    </div>
  );
}
