/**
 * In-Memory & LocalStorage API Cache with TTL
 * Speeds up page transitions and prevents redundant fetches
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
}

const memoryCache = new Map<string, CacheEntry<any>>();

export const apiCache = {
  get<T>(key: string): T | null {
    // 1. Check in-memory cache first
    const memEntry = memoryCache.get(key);
    if (memEntry) {
      if (Date.now() - memEntry.timestamp < memEntry.ttl) {
        return memEntry.data as T;
      } else {
        memoryCache.delete(key);
      }
    }

    // 2. Check localStorage cache
    try {
      const localStr = localStorage.getItem(`sh_cache_${key}`);
      if (localStr) {
        const localEntry: CacheEntry<T> = JSON.parse(localStr);
        if (Date.now() - localEntry.timestamp < localEntry.ttl) {
          // Populate memory cache for fast access next time
          memoryCache.set(key, localEntry);
          return localEntry.data;
        } else {
          localStorage.removeItem(`sh_cache_${key}`);
        }
      }
    } catch {
      // Ignore localStorage read errors
    }

    return null;
  },

  set<T>(key: string, data: T, ttlMs: number = 300000 /* 5 minutes default */): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };

    memoryCache.set(key, entry);

    try {
      localStorage.setItem(`sh_cache_${key}`, JSON.stringify(entry));
    } catch {
      // Ignore quota exceeded or storage disabled
    }
  },

  clear(key?: string): void {
    if (key) {
      memoryCache.delete(key);
      try {
        localStorage.removeItem(`sh_cache_${key}`);
      } catch {}
    } else {
      memoryCache.clear();
      try {
        Object.keys(localStorage)
          .filter((k) => k.startsWith('sh_cache_'))
          .forEach((k) => localStorage.removeItem(k));
      } catch {}
    }
  },

  async fetchCached<T>(
    url: string,
    options?: RequestInit,
    ttlMs: number = 180000 /* 3 minutes default */
  ): Promise<T> {
    const cached = apiCache.get<T>(url);
    if (cached) {
      // Revalidate in background without blocking caller
      fetch(url, options)
        .then((res) => (res.ok ? res.json() : null))
        .then((newData) => {
          if (newData) apiCache.set(url, newData, ttlMs);
        })
        .catch(() => {});
      return cached;
    }

    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    apiCache.set(url, data, ttlMs);
    return data as T;
  },
};
