import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import path from "path";
import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import { getServerSession } from "next-auth";
import authOptions from "@lib/auth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function GET() {
  const docs = await prisma.document.findMany();
  return NextResponse.json(docs);
}

export async function POST(req: NextRequest) {
  try {
    //  1. Check session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    //  2. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    console.log("File:", file.type, file.name, file.size);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // 3. Prepare upload path
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true }); // auto-create if missing
    }

    const uploadPath = path.join(uploadsDir, file.name);
    // 4. Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 5. Save file
    await writeFile(uploadPath, buffer);

    // set is db
    const document = await prisma.document.create({
      data: {
        name: file.name,
        type: file.type,
        size: file.size,
        path: `/uploads/${file.name}`,
      },
    });
    console.log("Document saved to DB:", document);

    // 6. Return success
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: document,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    // Return safe error message
    return NextResponse.json(
      { error: "Something went wrong", data: error },
      { status: 500 }
    );
  }
}
