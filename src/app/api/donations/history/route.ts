import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch donations for the current user, including project details
    const donations = await prisma.donation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donation history:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation history" },
      { status: 500 }
    );
  }
}
