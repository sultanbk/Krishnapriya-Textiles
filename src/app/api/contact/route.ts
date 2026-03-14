import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 submissions per 10 minutes
    const ip = getClientIp(req);
    const { limited, resetIn } = rateLimit(`contact:${ip}`, { limit: 5, windowSec: 600 });
    if (limited) {
      return NextResponse.json(
        { error: `Too many submissions. Please try again in ${resetIn} seconds.` },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, phone, email, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Name, phone and message are required" },
        { status: 400 }
      );
    }

    if (!/^\d{10}$/.test(phone.replace(/\s/g, ""))) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    await db.contactMessage.create({
      data: {
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        subject: subject || "General",
        message: message.trim(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
