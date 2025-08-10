import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  // Dynamically import authOptions to avoid type issues
  const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = await request.json();

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true },
    });
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  // Password change
  if (body.oldPassword && body.newPassword) {
    // Get user
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found or password not set" }, { status: 404 });
    }
    // Check old password
    const isValid = await bcrypt.compare(body.oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }
    // Hash new password
    const hashed = await bcrypt.hash(body.newPassword, 12);
    await prisma.user.update({
      where: { email: session.user.email },
      data: { password: hashed },
    });
    return NextResponse.json({ message: "Password updated successfully" });
  }
  // Avatar update
  if (body.avatar) {
    // Accepts avatar as a URL or base64 string
    await prisma.user.update({
      where: { email: session.user.email },
      data: { image: body.avatar },
    });
    return NextResponse.json({ message: "Avatar updated successfully" });
  }
  return NextResponse.json({ error: "Invalid request" }, { status: 400 });
} 