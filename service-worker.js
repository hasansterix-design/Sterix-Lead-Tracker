// Sterix Lead Tracker — Service Worker
// Caches only the app shell (HTML/CSS/JS/icons) so the app opens instantly.
// Does NOT cache Supabase API calls — leads must always come from the live
// database so everyone sees the same shared, up-to-date data.
//
// IMPORTANT: bump CACHE_NAME (e.g. v1 -> v2) every time index.html changes
// and is re-uploaded. Without this, installed apps can keep showing an old
// cached version indefinitely, even after you've updated the file online.

const CACHE_NAME = "sterix-leads-v3";
const ASSETS_TO_CACHE = [
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-512-maskable.png",
  "./apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Never cache Supabase API or realtime traffic — always go live.
  if (url.includes("supabase.co") || url.includes("supabase.in")) {
    return;
  }

  if (event.request.method !== "GET") return;

  const isHTML = event.request.mode === "navigate" || url.endsWith(".html") || url.endsWith("/");

  if (isHTML) {
    // Network-first for the app shell itself: always try to get the latest
    // version online, and only fall back to the cached copy if offline.
    // This is what makes updates show up immediately instead of being
    // stuck behind a stale cache.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Cache-first for static assets (icons, manifest) since those rarely change.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
