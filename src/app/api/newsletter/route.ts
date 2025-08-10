import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  // In a real application, you would add the email to your mailing list here.
  console.log(`Email subscribed: ${email}`);

  return NextResponse.json({ message: "Successfully subscribed!" });
}