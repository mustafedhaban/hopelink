import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
  const session = await getServerSession(authOptions);

  const { amount, projectId, donorName, donorEmail } = await request.json();

  if (!amount || !projectId || !donorName || !donorEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const donation = await prisma.donation.create({
      data: {
        amount: amount,
        projectId: projectId,
        donorName: donorName,
        donorEmail: donorEmail,
        userId: session?.user?.id, // Link to user if logged in
      },
    });
    return NextResponse.json({ donation });
  } catch (error) {
    console.error("Donation creation error:", error);
    return NextResponse.json({ error: "Failed to process donation" }, { status: 500 });
  }
}