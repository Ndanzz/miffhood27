export async function fetchWithOfflineCache<T>(
  cacheKey: string,
  fetcher: () => Promise<T | null>
): Promise<{ data: T | null; isFromCache: boolean }> {
  let cachedData: T | null = null;

  // Cek cadangan lokal terlebih dahulu
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        cachedData = JSON.parse(raw) as T;
      }
    } catch {
      cachedData = null;
    }
  }

  // Jika sedang offline di browser, langsung kembalikan data lokal
  if (typeof navigator !== "undefined" && !navigator.onLine && cachedData) {
    return { data: cachedData, isFromCache: true };
  }

  // Coba ambil data terbaru dari Supabase
  try {
    const freshData = await fetcher();
    if (freshData !== null) {
      if (typeof window !== "undefined") {
        localStorage.setItem(cacheKey, JSON.stringify(freshData));
      }
      return { data: freshData, isFromCache: false };
    }
  } catch {
    // Jika koneksi terputus di tengah jalan, jatuh ke cache lokal
  }

  return { data: cachedData, isFromCache: true };
}