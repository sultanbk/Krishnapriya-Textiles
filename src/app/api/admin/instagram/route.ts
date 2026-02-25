import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/instagram — List all Instagram videos (admin)
 * POST /api/admin/instagram — Add a new Instagram video link (admin)
 */

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const videos = await db.instagramVideo.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url, title } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Instagram URL is required" },
        { status: 400 }
      );
    }

    // Validate it's an Instagram URL
    if (!url.includes("instagram.com")) {
      return NextResponse.json(
        { error: "Please enter a valid Instagram URL" },
        { status: 400 }
      );
    }

    // Get next position
    const lastVideo = await db.instagramVideo.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const video = await db.instagramVideo.create({
      data: {
        url: url.trim(),
        title: title?.trim() || "",
        position: (lastVideo?.position ?? -1) + 1,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error: any) {
    console.error("Create instagram video error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
