import { db } from "@/lib/db";

/**
 * Fetch a site image by key. Returns the URL or null if not set.
 * Uses the Setting model with group="site-images".
 */
export async function getSiteImage(key: string): Promise<string | null> {
  try {
    const setting = await db.setting.findUnique({ where: { key } });
    return setting?.value || null;
  } catch {
    return null;
  }
}

/**
 * Fetch multiple site images at once. Returns a key-value map.
 */
export async function getSiteImages(
  keys: string[]
): Promise<Record<string, string>> {
  try {
    const settings = await db.setting.findMany({
      where: { key: { in: keys }, group: "site-images" },
    });
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    return map;
  } catch {
    return {};
  }
}
