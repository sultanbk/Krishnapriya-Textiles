import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * PUT /api/admin/instagram/[id] — Update an Instagram video
 * DELETE /api/admin/instagram/[id] — Delete an Instagram video
 */

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const video = await db.instagramVideo.update({
      where: { id },
      data: {
        ...(body.url && { url: body.url.trim() }),
        ...(body.title !== undefined && { title: body.title.trim() }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.position !== undefined && { position: body.position }),
      },
    });

    return NextResponse.json(video);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await db.instagramVideo.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
