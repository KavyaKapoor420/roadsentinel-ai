/**
 * API service layer.
 *
 * SWAP POINT: change `MOCK = false` and set VITE_API_BASE_URL once your
 * FastAPI backend is reachable. All UI calls go through this module.
 */
import { violations, stats, violationsByType, dailyTrends, vehicleDistribution, ocrAccuracy, detectionPerf, type Violation } from "@/lib/mockData";

const MOCK = true;
export const API_BASE_URL = (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL ?? "/api";

async function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((r) => setTimeout(() => r(value), ms));
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

export const api = {
  async login(email: string, _password: string) {
    if (MOCK) return delay({ token: "mock-jwt-token", user: { email, name: "Officer Demo" } });
    return request<{ token: string; user: unknown }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password: _password }) });
  },
  async register(payload: { name: string; email: string; password: string }) {
    if (MOCK) return delay({ token: "mock-jwt-token", user: { email: payload.email, name: payload.name } });
    return request("/auth/register", { method: "POST", body: JSON.stringify(payload) });
  },
  async forgotPassword(email: string) {
    if (MOCK) return delay({ ok: true, email });
    return request("/auth/forgot", { method: "POST", body: JSON.stringify({ email }) });
  },
  async getStats() {
    if (MOCK) return delay(stats);
    return request<typeof stats>("/stats");
  },
  async getViolations(): Promise<Violation[]> {
    if (MOCK) return delay(violations);
    return request<Violation[]>("/violations");
  },
  async getViolation(id: string): Promise<Violation | undefined> {
    if (MOCK) return delay(violations.find((v) => v.id === id));
    return request<Violation>(`/violations/${id}`);
  },
  async getAnalytics(): Promise<{
    violationsByType: typeof violationsByType;
    dailyTrends: typeof dailyTrends;
    vehicleDistribution: typeof vehicleDistribution;
    ocrAccuracy: typeof ocrAccuracy;
    detectionPerf: typeof detectionPerf;
  }> {
    if (MOCK) return delay({ violationsByType, dailyTrends, vehicleDistribution, ocrAccuracy, detectionPerf });
    return request("/analytics");
  },
  async generateReport(_payload: { from: string; to: string; format: "csv" | "pdf" }): Promise<{ url: string; filename: string }> {
    if (MOCK) return delay({ url: "#", filename: `report-${Date.now()}.${_payload.format}` });
    return request("/reports", { method: "POST", body: JSON.stringify(_payload) });
  },
};
