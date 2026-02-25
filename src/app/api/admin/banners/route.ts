import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const banner = await db.banner.create({
      data: {
        title: body.title,
        subtitle: body.subtitle || null,
        image: body.image,
        mobileImage: body.mobileImage || null,
        link: body.link || null,
        position: body.position ?? 0,
        isActive: body.isActive ?? true,
      },
    });

    return NextResponse.json({ success: true, banner }, { status: 201 });
  } catch (error: any) {
    console.error("Create banner error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
