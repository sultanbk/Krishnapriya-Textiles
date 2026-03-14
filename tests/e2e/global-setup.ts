/**
 * Global setup: warm up the dev server by hitting the homepage
 * before any tests run. This ensures the DB connection pool is
 * initialized and initial compilation is done.
 */
async function globalSetup() {
  const baseURL = "http://localhost:3000";
  const maxRetries = 10;
  const retryDelay = 3000;

  console.log("[global-setup] Warming up the dev server...");

  for (let i = 0; i < maxRetries; i++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const res = await fetch(baseURL, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok || res.status < 500) {
        console.log(`[global-setup] Server is warm (status: ${res.status})`);
        // Hit a second page to warm the DB connection pool
        try {
          await fetch(`${baseURL}/about`, { signal: AbortSignal.timeout(15000) });
        } catch {
          // OK if it fails
        }
        return;
      }

      console.log(`[global-setup] Attempt ${i + 1}: status ${res.status}, retrying...`);
    } catch (err) {
      console.log(`[global-setup] Attempt ${i + 1}: connection failed, retrying in ${retryDelay}ms...`);
    }

    await new Promise((r) => setTimeout(r, retryDelay));
  }

  console.warn("[global-setup] Warning: server may not be fully warmed up");
}

export default globalSetup;
