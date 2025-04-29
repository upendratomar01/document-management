import { getUsers } from "@features/dashboard/users/actions/userActions";
import ClientTable from "./components/ClientTable";
import { UserType } from "./types";
import { getServerSession } from "next-auth";
import authOptions from "@lib/auth";
import { ROLES, ROUTES } from "@/constants/routes";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect(ROUTES.SIGNIN);

  const users: UserType[] = (await getUsers()).map((user) => ({
    ...user,
    role: user.role as ROLES, // Ensure role matches the expected type
  }));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <ClientTable initialUsers={users} />
    </div>
  );
}
