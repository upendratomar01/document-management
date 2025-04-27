import { getUsers } from "@/lib/actions/userActions";
import ClientTable from "./components/ClientTable";
import { UserType } from "./types";

export default async function UsersPage() {
  const users: UserType[] = await getUsers();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <ClientTable initialUsers={users} />
    </div>
  );
}
