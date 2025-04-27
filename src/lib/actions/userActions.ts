"use server";

import { ROLES } from "@/constants/routes";
import prisma from "@/lib/prisma";

export async function getUsers() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true },
  });
  return users;
}

export async function updateUserAction(data: {
  id: string;
  name: string;
  role: ROLES;
}) {
  await prisma.user.update({
    where: { id: data.id },
    data: { name: data.name, role: data.role },
  });
}

export async function deleteUserAction(id: string) {
  await prisma.user.delete({
    where: { id },
  });
}
