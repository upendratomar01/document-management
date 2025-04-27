import { NextResponse } from "next/server";
import prismm from "@/lib/prisma"; // Adjust the import based on your project structure

export async function GET() {
  try {
    const users = await prismm.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.log("CATCH ERROR", error);
    return NextResponse.json(
      { error: "Error fetching users" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const { role } = await req.json();
    const user = await prismm.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const updatedUser = await prismm.user.update({
      where: { id },
      data: { role },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("CATCH ERROR", error);
    return NextResponse.json({ error: "Error updating user" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const user = await prismm.user.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await prismm.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.log("CATCH ERROR", error);
    return NextResponse.json({ error: "Error deleting user" }, { status: 500 });
  }
}
