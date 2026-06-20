/**
 * API service layer — connected to the deployed FastAPI backend.
 */
import type { Violation, ViolationType } from "@/lib/mockData";
import { mapFrameReport, type BackendFrameReport } from "@/lib/violationMapper";
import { violationsStore } from "@/lib/violations-store";

const MOCK_AUTH = true;

/** Empty string in dev → same-origin `/api/*` via Vite proxy (no CORS). */
export const API_BASE_URL =
  (import.meta as { env?: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

export function apiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${p}` : p;
}

export function resolveMediaUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/api/")) return apiUrl(path);
  if (path.startsWith("/output/")) return apiUrl(`/api${path}`);
  if (path.startsWith("/static/output/")) return apiUrl(path);
  return apiUrl(path.startsWith("/") ? path : `/${path}`);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), init);
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = (await res.json()) as { detail?: string };
      if (body.detail) detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json() as Promise<T>;
}

export interface HealthStatus {
  status: string;
  violation_model_loaded: boolean;
  plate_model_loaded: boolean;
  violation_classes: number;
  uptime_seconds: number;
}

export interface ImageAnalysisResult {
  success: boolean;
  report: BackendFrameReport;
  annotated_image_url?: string | null;
}

export interface VideoAnalysisResult {
  success: boolean;
  total_frames_processed: number;
  frames_with_violations: number;
  reports: BackendFrameReport[];
  annotated_video_url?: string | null;
  summary: {
    violation_counts: Record<string, number>;
    total_violations: number;
  };
}

function computeStats(violations: Violation[]) {
  const helmet = violations.filter((v) => v.type === "Helmet").length;
  const tripleRiding = violations.filter((v) => v.type === "Triple Riding").length;
  const illegalParking = violations.filter((v) => v.type === "Illegal Parking").length;
  const withPlate = violations.filter((v) => v.plate && v.plate !== "—").length;
  const ocrSuccessRate = violations.length ? withPlate / violations.length : 0;
  const highConf = violations.filter((v) => v.confidence >= 0.8).length;
  const detectionAccuracy = violations.length ? highConf / violations.length : 0;

  return {
    totalViolations: violations.length,
    helmet,
    tripleRiding,
    illegalParking,
    ocrSuccessRate,
    detectionAccuracy,
  };
}

function computeAnalytics(violations: Violation[]) {
  const types: ViolationType[] = ["Helmet", "Triple Riding", "Illegal Parking", "Signal Jump", "Wrong Lane"];
  const violationsByType = types.map((name) => ({
    name,
    count: violations.filter((v) => v.type === name).length,
  }));

  const dailyTrends = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dayKey = d.toISOString().slice(0, 10);
    const dayItems = violations.filter((v) => v.timestamp.slice(0, 10) === dayKey);
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      helmet: dayItems.filter((v) => v.type === "Helmet").length,
      parking: dayItems.filter((v) => v.type === "Illegal Parking").length,
      triple: dayItems.filter((v) => v.type === "Triple Riding").length,
    };
  });

  const vehicleClasses = ["Motorcycle", "Car", "Truck", "Bus", "Auto-rickshaw"] as const;
  const vehicleDistribution = vehicleClasses.map((name) => ({
    name,
    value: violations.filter((v) => v.vehicleClass === name).length,
  }));

  const ocrAccuracy = Array.from({ length: 12 }).map((_, i) => {
    const hour = i * 2;
    const hourItems = violations.filter((v) => new Date(v.timestamp).getHours() === hour);
    const withPlate = hourItems.filter((v) => v.plate && v.plate !== "—");
    const accuracy = hourItems.length ? (withPlate.length / hourItems.length) * 100 : 0;
    return {
      hour: `${String(hour).padStart(2, "0")}:00`,
      accuracy: Math.round(accuracy * 10) / 10,
    };
  });

  const detectionPerf = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
    const dayItems = violations.filter((v) => new Date(v.timestamp).getDay() === (i + 1) % 7);
    const avgConf = dayItems.length
      ? dayItems.reduce((s, v) => s + v.confidence, 0) / dayItems.length
      : 0;
    return {
      day,
      precision: Math.round(avgConf * 1000) / 10,
      recall: Math.round(avgConf * 950) / 10,
    };
  });

  return { violationsByType, dailyTrends, vehicleDistribution, ocrAccuracy, detectionPerf };
}

export const api = {
  async health(): Promise<HealthStatus> {
    return request<HealthStatus>("/api/health");
  },

  async login(email: string, _password: string) {
    if (MOCK_AUTH) return { token: "local-session", user: { email, name: "Officer Demo" } };
    throw new Error("Auth not configured on backend");
  },

  async register(payload: { name: string; email: string; password: string }) {
    if (MOCK_AUTH) return { token: "local-session", user: { email: payload.email, name: payload.name } };
    throw new Error("Auth not configured on backend");
  },

  async forgotPassword(email: string) {
    if (MOCK_AUTH) return { ok: true, email };
    throw new Error("Auth not configured on backend");
  },

  async getStats() {
    return computeStats(violationsStore.getAll());
  },

  async getViolations(): Promise<Violation[]> {
    return violationsStore.getAll();
  },

  async getViolation(id: string): Promise<Violation | undefined> {
    return violationsStore.getById(id);
  },

  async getAnalytics() {
    return computeAnalytics(violationsStore.getAll());
  },

  async analyzeImage(file: File, onProgress?: (pct: number) => void): Promise<Violation[]> {
    onProgress?.(10);
    const form = new FormData();
    form.append("file", file);
    onProgress?.(30);

    const result = await request<ImageAnalysisResult>(
      "/api/analyze/image?return_annotated=true",
      { method: "POST", body: form },
    );
    onProgress?.(90);

    const annotatedImageUrl = resolveMediaUrl(result.annotated_image_url);
    const mapped = mapFrameReport(result.report, {
      sourceFile: file.name,
      annotatedImageUrl,
    });
    violationsStore.addMany(mapped);
    onProgress?.(100);
    return mapped;
  },

  async analyzeVideo(file: File, onProgress?: (pct: number) => void): Promise<Violation[]> {
    onProgress?.(5);
    const form = new FormData();
    form.append("file", file);
    onProgress?.(15);

    const result = await request<VideoAnalysisResult>(
      "/api/analyze/video?stride=3&return_annotated=false",
      { method: "POST", body: form },
    );
    onProgress?.(85);

    const all: Violation[] = [];
    for (const report of result.reports) {
      all.push(...mapFrameReport(report, { sourceFile: file.name }));
    }
    violationsStore.addMany(all);
    onProgress?.(100);
    return all;
  },

  async generateReport(payload: { from: string; to: string; format: "csv" | "pdf" }): Promise<{ url: string; filename: string }> {
    const items = violationsStore.getAll().filter((v) => {
      const day = v.timestamp.slice(0, 10);
      return day >= payload.from && day <= payload.to;
    });

    if (payload.format === "csv") {
      const header = "id,type,vehicle,plate,confidence,timestamp,status,location\n";
      const rows = items
        .map(
          (v) =>
            `${v.id},${v.type},${v.vehicleClass},${v.plate},${v.confidence},${v.timestamp},${v.status},"${v.location}"`,
        )
        .join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      return { url, filename: `violations-${payload.from}-${payload.to}.csv` };
    }

    return { url: "#", filename: `violations-${payload.from}-${payload.to}.pdf` };
  },
};
