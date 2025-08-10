import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { name, email, organization, message } = await request.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // In a real application, you would send an email or save the message to a database here.
  console.log("New contact form submission:", { name, email, organization, message });

  return NextResponse.json({ message: "Message sent successfully!" });
}