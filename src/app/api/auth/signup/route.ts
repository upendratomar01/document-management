import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name, allowExtraEmails } = body;

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        allowExtraEmails,
        role: Role.USER, // default role
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Something went wrong! Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "User created successfully", ok: true },
    { status: 201 }
  );
}
