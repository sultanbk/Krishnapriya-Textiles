const CACHE_VERSION = "kpt-v2";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;
const IMAGES_CACHE = `${CACHE_VERSION}-images`;

// Static assets to pre-cache on install
const PRECACHE = ["/manifest.json", "/offline"];

// Offline fallback HTML (shown when server is down & no cached version)
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Offline — Krishnapriya Textiles</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:system-ui,-apple-system,sans-serif;background:#fffaf5;color:#1a1a1a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
    .c{text-align:center;max-width:400px}
    h1{font-size:1.5rem;color:#6b1420;margin-bottom:.75rem}
    p{color:#666;font-size:.95rem;line-height:1.6;margin-bottom:1.5rem}
    .icon{font-size:3rem;margin-bottom:1rem}
    button{background:#6b1420;color:#fff;border:none;padding:.75rem 2rem;border-radius:.75rem;font-size:.95rem;cursor:pointer;font-weight:600}
    button:hover{background:#8b1a2a}
  </style>
</head>
<body>
  <div class="c">
    <div class="icon">📡</div>
    <h1>You&rsquo;re Offline</h1>
    <p>It looks like you&rsquo;ve lost your internet connection or the server is not running. Please check your connection and try again.</p>
    <button onclick="location.reload()">Try Again</button>
  </div>
</body>
</html>`;

// ─── Install ───
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate — clean old caches ───
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !key.startsWith(CACHE_VERSION))
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ───
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== "GET") return;

  // Skip API routes, admin panel, and auth routes (never cache these)
  if (
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/admin") ||
    url.pathname.startsWith("/login") ||
    url.pathname.startsWith("/verify-otp") ||
    url.pathname.startsWith("/complete-profile") ||
    url.pathname.startsWith("/account") ||
    url.pathname.startsWith("/checkout") ||
    url.pathname.startsWith("/orders")
  ) {
    return;
  }

  // ── Images (Cloudinary, local) — cache-first, 7-day expiry ──
  if (
    url.pathname.match(/\.(png|jpg|jpeg|webp|svg|ico|gif)$/) ||
    url.hostname === "res.cloudinary.com"
  ) {
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => new Response("", { status: 408 }));
        })
      )
    );
    return;
  }

  // ── Static assets (JS, CSS, fonts) — cache-first ──
  if (url.pathname.match(/\.(js|css|woff2?)$/)) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) =>
        cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => new Response("", { status: 408 }));
        })
      )
    );
    return;
  }

  // ── HTML pages — NETWORK-FIRST, fall back to offline page ──
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful page loads
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Server is down → show offline page, NOT stale cached content.
          // This prevents the confusing "site still works after stopping server" issue.
          return new Response(OFFLINE_HTML, {
            status: 503,
            headers: { "Content-Type": "text/html; charset=utf-8" },
          });
        })
    );
    return;
  }
});
