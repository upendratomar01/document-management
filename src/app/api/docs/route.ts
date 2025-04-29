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
    // 🔹 1. Check session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 🔹 2. Parse form data
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
    console.error("❌ Upload error:", error);

    // Return safe error message
    return NextResponse.json(
      { error: error?.message || "Something went wrong" },
      { status: 500 }
    );
  }

  // const formData = await req.formData();
  // const file = formData.get("file") as File;

  // if (!file) {
  //   return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  // }

  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);

  // const uploadPath = path.join(process.cwd(), "public", "uploads", file.name);
  // await writeFile(uploadPath, buffer);

  // console.log(`Uploaded ${file.name} successfully!`);

  // return NextResponse.json({ success: true });
}

// export async function POST(req: Request) {
//   const form = new IncomingForm();
//   form.uploadDir = path.join(process.cwd(), "uploads");
//   form.keepExtensions = true;

//   return new Promise((resolve, reject) => {
//     form.parse(req, async (err, fields, files) => {
//       if (err) return reject(err);

//       const file = files.file[0];
//       const document = await prisma.document.create({
//         data: {
//           name: file.originalFilename as string,
//           type: file.mimetype as string,
//           size: file.size as number,
//           path: file.filepath as string,
//         },
//       });

//       return resolve(NextResponse.json(document));
//     });
//   });
// }

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  const updatedDocument = await prisma.document.update({
    where: { id },
    data: { name },
  });

  return NextResponse.json(updatedDocument);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.document.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Document deleted" });
}
