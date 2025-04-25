import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Mock login logic
  if (email && password) {
    return NextResponse.json({
      token: "mock-token",
      user: { email, role: "admin" },
    });
  }

  return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
}
