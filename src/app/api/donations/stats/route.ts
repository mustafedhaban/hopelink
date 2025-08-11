import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const projectId = url.searchParams.get("projectId");

  try {
    // Build the where clause based on whether projectId is provided
    const whereClause = {
      status: "COMPLETED",
      ...(projectId && { projectId: projectId }),
    };

    // Get aggregated donation statistics
    const [aggregateResult, uniqueDonorCount, projectDetails] = await Promise.all([
      // Get total amount, count, and average
      prisma.donation.aggregate({
        where: whereClause,
        _sum: { amount: true },
        _count: { id: true },
        _avg: { amount: true },
      }),
      
      // Get unique donor count (combining userId and donorEmail for anonymous donations)
      prisma.$queryRaw<[{ uniqueDonors: number }]>`
        SELECT COUNT(DISTINCT COALESCE("userId", "donorEmail")) as "uniqueDonors"
        FROM "Donation" 
        WHERE "status" = 'COMPLETED' 
        ${projectId ? `AND "projectId" = '${projectId}'` : ''}
      `,
      
      // Get project details if projectId is provided
      projectId 
        ? prisma.project.findUnique({
            where: { id: projectId },
            select: {
              goal: true,
              currentFunding: true,
            },
          })
        : Promise.resolve(null)
    ]);

    const stats = {
      totalAmount: aggregateResult._sum.amount || 0,
      donationCount: aggregateResult._count.id || 0,
      averageDonation: aggregateResult._avg.amount || 0,
      uniqueDonors: uniqueDonorCount[0]?.uniqueDonors || 0,
      ...(projectDetails && {
        goalProgress: {
          current: projectDetails.currentFunding,
          target: projectDetails.goal,
          percentage: (projectDetails.currentFunding / projectDetails.goal) * 100,
        }
      })
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error("Error fetching donation statistics:", error);
    return NextResponse.json(
      { error: "Failed to fetch donation statistics" },
      { status: 500 }
    );
  }
}
