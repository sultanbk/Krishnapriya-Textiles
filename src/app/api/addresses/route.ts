import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { addressSchema } from "@/validators/address";

/**
 * GET /api/addresses — List current user's addresses
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const addresses = await db.address.findMany({
      where: { userId: session.userId },
      orderBy: { isDefault: "desc" },
    });

    return NextResponse.json(addresses);
  } catch (error: any) {
    console.error("Get addresses error:", error);
    return NextResponse.json(
      { error: "Failed to load addresses" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/addresses — Create a new address
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const data = addressSchema.parse(body);

    // If this is the first address or marked as default, handle default logic
    if (data.isDefault) {
      await db.address.updateMany({
        where: { userId: session.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Check if this is the user's first address — auto-set as default
    const existingCount = await db.address.count({
      where: { userId: session.userId },
    });

    const address = await db.address.create({
      data: {
        ...data,
        userId: session.userId,
        isDefault: data.isDefault || existingCount === 0,
      },
    });

    return NextResponse.json(address, { status: 201 });
  } catch (error: any) {
    console.error("Create address error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create address" },
      { status: 500 }
    );
  }
}
