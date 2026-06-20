import type { Violation } from "@/lib/mockData";

const STORAGE_KEY = "trafficvision_violations";

function readAll(): Violation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Violation[]) : [];
  } catch {
    return [];
  }
}

function writeAll(items: Violation[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export const violationsStore = {
  getAll(): Violation[] {
    return readAll().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
  getById(id: string): Violation | undefined {
    return readAll().find((v) => v.id === id);
  },
  addMany(items: Violation[]) {
    if (items.length === 0) return;
    writeAll([...items, ...readAll()]);
  },
  clear() {
    writeAll([]);
  },
};
