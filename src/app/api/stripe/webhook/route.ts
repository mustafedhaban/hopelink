import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-11-20.acacia",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Check if donation already exists
      const existingDonation = await prisma.donation.findFirst({
        where: { stripeSessionId: session.id },
      });

      if (!existingDonation && session.metadata) {
        // Create donation record
        console.log("Webhook - Session metadata:", session.metadata);
        
        // Properly handle userId - ensure it's either a valid ID or null
        let userId: string | null = null;
        if (session.metadata.userId && session.metadata.userId !== "" && session.metadata.userId !== "null") {
          // Verify the user exists in the database
          const userExists = await prisma.user.findUnique({
            where: { id: session.metadata.userId }
          });
          if (userExists) {
            userId = session.metadata.userId;
          }
        }
        
        console.log("Webhook - Final userId:", userId);
        
        const donation = await prisma.donation.create({
          data: {
            amount: parseFloat(session.metadata.amount),
            projectId: session.metadata.projectId,
            donorName: session.metadata.donorName,
            donorEmail: session.metadata.donorEmail,
            userId: userId,
            stripeSessionId: session.id,
            status: "COMPLETED",
          },
        });

        console.log("Donation created:", donation);

        // Update project funding if needed
        await prisma.project.update({
          where: { id: session.metadata.projectId },
          data: {
            currentFunding: {
              increment: parseFloat(session.metadata.amount),
            },
          },
        });
      }
    } catch (error) {
      console.error("Error processing completed payment:", error);
      return NextResponse.json(
        { error: "Failed to process payment" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
