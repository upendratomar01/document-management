"use server";

import prisma from "@/lib/prisma";
import authOptions from "@lib/auth";
import { getServerSession } from "next-auth";

export async function getDocs() {
  try {
    const docs = await prisma.document.findMany({});
    return docs;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
}

export async function deleteDocAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "Unauthorized!", status: 401 };
    }

    await prisma.document.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.log("CATCHED ERROR----", error);
    return { error: "Failed to delete document" };
  }
}
