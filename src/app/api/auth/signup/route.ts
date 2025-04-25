import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password, name, allowExtraEmails } = await req.json();

  if (email && password && name && allowExtraEmails) {
    return NextResponse.json({ message: "User created" }, { status: 201 });
  }

  return NextResponse.json({ message: "Missing fields" }, { status: 400 });
}
