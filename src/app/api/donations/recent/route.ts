import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");
  const limitStr = url.searchParams.get("limit");
  const limit = limitStr ? parseInt(limitStr, 10) : 10;

  try {
    // Build the where clause based on whether projectId is provided
    const whereClause = {
      status: "COMPLETED",
      ...(projectId && { projectId: projectId }),
    };

    // Fetch recent donations with project details
    const donations = await prisma.donation.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(limit, 50), // Limit to max 50 for performance
    });

    return NextResponse.json({ donations }, { status: 200 });
  } catch (error) {
    console.error("Error fetching recent donations:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent donations" },
      { status: 500 }
    );
  }
}
