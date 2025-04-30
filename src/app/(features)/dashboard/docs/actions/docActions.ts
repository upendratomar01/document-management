"use server";

import prisma from "@/lib/prisma";
import authOptions from "@lib/auth";
import { getServerSession } from "next-auth";
export async function getDocsAction() {
  try {
    const docs = await prisma.document.findMany({});
    return docs;
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
}

export async function getDocByIdAction(id: string) {
  try {
    const doc = await prisma.document.findUnique({
      where: { id },
    });
    return doc;
  } catch (error) {
    console.log("CATCHED ERROR----", error);
    // throw new Error("Failed to fetch document");
    return null;
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

export async function triggerIngestionAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "Unauthorized!", status: 401 };
    }
    // Set to in progreess first
    await prisma.document.update({
      where: { id },
      data: { ingestionStatus: "IN_PROGRESS" },
    });
    // Delay and set to completed/failed
    setTimeout(async () => {
      const isSuccess = Math.random() > 0.3;
      await prisma.document.update({
        where: { id },
        data: { ingestionStatus: isSuccess ? "COMPLETED" : "FAILED" },
      });
    }, 4000);
    return { success: true };
  } catch (error) {
    console.log("CATCHED ERROR----", error);
    return { error: "Failed to ingest document" };
  }
}
