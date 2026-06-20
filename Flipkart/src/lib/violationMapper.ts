import type { VehicleClass, Violation, ViolationType } from "@/lib/mockData";

/** Backend violation type identifiers (from violations/*.py). */
export type BackendViolationType =
  | "NO_HELMET"
  | "TRIPLE_RIDING"
  | "RED_LIGHT_VIOLATION"
  | "ILLEGAL_PARKING"
  | "STOP_LINE_VIOLATION"
  | "MODIFIED_VEHICLE";

export interface BackendPlateInfo {
  text: string;
  confidence: number;
  bbox: number[];
}

export interface BackendViolation {
  type: string;
  confidence: number;
  severity: string;
  bbox: number[];
  plate?: BackendPlateInfo | null;
  details?: Record<string, unknown>;
}

export interface BackendFrameReport {
  frame_id: number;
  timestamp: number;
  violation_count: number;
  plate_count: number;
  violations: BackendViolation[];
  plates: Array<Record<string, unknown>>;
  detection_count: number;
  processing_time_ms: number;
}

const TYPE_MAP: Record<string, ViolationType> = {
  NO_HELMET: "Helmet",
  TRIPLE_RIDING: "Triple Riding",
  ILLEGAL_PARKING: "Illegal Parking",
  RED_LIGHT_VIOLATION: "Signal Jump",
  STOP_LINE_VIOLATION: "Wrong Lane",
  MODIFIED_VEHICLE: "Wrong Lane",
};

const VEHICLE_MAP: Record<string, VehicleClass> = {
  motorcycle: "Motorcycle",
  two_wheeler: "Motorcycle",
  bike: "Motorcycle",
  car: "Car",
  truck: "Truck",
  bus: "Bus",
  three_wheeler: "Auto-rickshaw",
  auto: "Auto-rickshaw",
  van: "Car",
};

function mapVehicleClass(details?: Record<string, unknown>): VehicleClass {
  const raw = String(details?.vehicle_type ?? details?.vehicle_class ?? "").toLowerCase();
  for (const [key, value] of Object.entries(VEHICLE_MAP)) {
    if (raw.includes(key)) return value;
  }
  return "Motorcycle";
}

function formatPlate(plate?: BackendPlateInfo | null): string {
  if (!plate?.text) return "—";
  return plate.text.trim().toUpperCase();
}

let idCounter = 0;

export function mapBackendViolation(
  v: BackendViolation,
  ctx: { frameId?: number; sourceFile?: string; annotatedImageUrl?: string },
): Violation {
  idCounter += 1;
  const ts = new Date();
  return {
    id: `VIO-${Date.now()}-${idCounter}`,
    type: TYPE_MAP[v.type] ?? "Helmet",
    vehicleClass: mapVehicleClass(v.details),
    plate: formatPlate(v.plate),
    confidence: v.confidence,
    timestamp: ts.toISOString(),
    status: v.severity === "HIGH" ? "Verified" : "Pending",
    location: ctx.sourceFile ? `Upload · ${ctx.sourceFile}` : "Uploaded footage",
    imageUrl: ctx.annotatedImageUrl,
    bbox: v.bbox,
    severity: v.severity,
    frameId: ctx.frameId,
    sourceFile: ctx.sourceFile,
    backendType: v.type,
  };
}

export function mapFrameReport(
  report: BackendFrameReport,
  ctx: { sourceFile?: string; annotatedImageUrl?: string },
): Violation[] {
  return report.violations.map((v) =>
    mapBackendViolation(v, {
      frameId: report.frame_id,
      sourceFile: ctx.sourceFile,
      annotatedImageUrl: ctx.annotatedImageUrl,
    }),
  );
}
