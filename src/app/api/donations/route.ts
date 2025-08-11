import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

export async function POST(request: NextRequest) {
  const { authOptions } = await import("@/app/api/auth/[...nextauth]/route");
  const session = await getServerSession(authOptions);

  const { amount, projectId, donorName, donorEmail } = await request.json();

  if (!amount || !projectId || !donorName || !donorEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (amount < 1) {
    return NextResponse.json({ error: "Amount must be at least $1" }, { status: 400 });
  }

  try {
    // Get project details for the checkout session
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Donation to ${project.title}`,
              description: project.description || "Supporting a great cause",
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donations/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donations?canceled=true`,
      customer_email: donorEmail,
      metadata: {
        projectId,
        donorName,
        donorEmail,
        userId: session?.user?.id || "",
        amount: amount.toString(),
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id });
  } catch (error) {
    console.error("Stripe checkout session creation error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}

// Handle successful payments via webhook
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "No session ID provided" }, { status: 400 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === "paid") {
      // Check if donation already exists
      const existingDonation = await prisma.donation.findFirst({
        where: { stripeSessionId: sessionId },
      });

      if (!existingDonation) {
        // Create donation record
        console.log("Session metadata:", session.metadata);
        
        // Properly handle userId - ensure it's either a valid ID or null
        let userId: string | null = null;
        if (session.metadata!.userId && session.metadata!.userId !== "" && session.metadata!.userId !== "null") {
          // Verify the user exists in the database
          const userExists = await prisma.user.findUnique({
            where: { id: session.metadata!.userId }
          });
          if (userExists) {
            userId = session.metadata!.userId;
          }
        }
        
        console.log("Final userId:", userId);
        
        const donation = await prisma.donation.create({
          data: {
            amount: parseFloat(session.metadata!.amount),
            projectId: session.metadata!.projectId,
            donorName: session.metadata!.donorName,
            donorEmail: session.metadata!.donorEmail,
            userId: userId,
            stripeSessionId: sessionId,
            status: "COMPLETED",
          },
        });
        
        return NextResponse.json({ donation, session });
      }
    }
    
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
