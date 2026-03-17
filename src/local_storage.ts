type Serializable = string | number | boolean | object | null;

export const storage = {
  get<T extends Serializable>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  },

  set<T extends Serializable>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`storage.set("${key}") failed:`, e);
    }
  },

  remove(key: string): void {
    localStorage.removeItem(key);
  },

  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  },

  clear(): void {
    localStorage.clear();
  },
};
