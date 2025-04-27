"use client";

import { ROLES } from "@/constants/routes";
import { useSession } from "next-auth/react";

export function useRole() {
  const { data: session } = useSession();
  const role = session?.user?.role as ROLES | undefined;

  return { role, isAdmin: role === ROLES.ADMIN, isUser: role === ROLES.USER };
}
