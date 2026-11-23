const CACHE_NAME = "miffhood27-offline-v2";

// Daftar rute utama yang wajib langsung di-cache saat aplikasi pertama kali dibuka
const CORE_ASSETS = [
  "/",
  "/manifest.json",
  "/icon-192x192.png",
  "/icon-512x512.png"
];

// 1. Install: Simpan aset dasar ke cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 2. Activate: Bersihkan cache versi lama
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3. Fetch: Strategi Network-First untuk data terbaru, otomatis fallback ke Cache saat Offline
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Cache semua halaman internal Next.js (_next/static, rute halaman) dan API Supabase
  if (
    url.origin === self.location.origin ||
    url.hostname.includes("supabase.co")
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Saat offline: ambil dari Cache, atau kembalikan halaman utama '/' jika rute belum sempat dibuka
          return caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || caches.match("/");
          });
        })
    );
  }
});