import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * GET /api/admin/site-images
 * Returns all site image settings (group = "site-images")
 */
export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const images = await db.setting.findMany({
      where: { group: "site-images" },
      orderBy: { key: "asc" },
    });

    // Convert to a key-value map for easy consumption
    const imageMap: Record<string, string> = {};
    for (const img of images) {
      imageMap[img.key] = img.value;
    }

    return NextResponse.json(imageMap);
  } catch (error) {
    console.error("Get site images error:", error);
    return NextResponse.json(
      { error: "Failed to load site images" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/site-images
 * Upserts site image settings. Body: { key: url, key2: url2, ... }
 */
export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validate: only accept known keys
    const allowedKeys = [
      "hero-visual",        // Right side image on static hero
      "about-hero",         // About page hero image
      "about-story",        // About page story section image
      "about-store",        // About page store photo
      "og-image",           // Open Graph / social share image
      "logo",               // Site logo
      "logo-dark",          // Site logo dark variant
      "favicon",            // Favicon
    ];

    const updates: { key: string; value: string }[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.includes(key)) continue;
      if (typeof value !== "string") continue;
      updates.push({ key, value: value as string });
    }

    // Upsert each setting
    for (const { key, value } of updates) {
      if (value) {
        await db.setting.upsert({
          where: { key },
          create: { key, value, group: "site-images" },
          update: { value },
        });
      } else {
        // Empty value = delete the setting
        await db.setting.deleteMany({ where: { key } });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update site images error:", error);
    return NextResponse.json(
      { error: "Failed to update site images" },
      { status: 500 }
    );
  }
}
