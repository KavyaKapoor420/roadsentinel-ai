export type ViolationType = "Helmet" | "Triple Riding" | "Illegal Parking" | "Signal Jump" | "Wrong Lane";
export type VehicleClass = "Motorcycle" | "Car" | "Truck" | "Bus" | "Auto-rickshaw";
export type ViolationStatus = "Pending" | "Verified" | "Dismissed" | "Notified";

export interface Violation {
  id: string;
  type: ViolationType;
  vehicleClass: VehicleClass;
  plate: string;
  confidence: number;
  timestamp: string;
  status: ViolationStatus;
  location: string;
  imageUrl?: string;
  bbox?: number[];
  severity?: string;
  frameId?: number;
  sourceFile?: string;
  backendType?: string;
}

const types: ViolationType[] = ["Helmet", "Triple Riding", "Illegal Parking", "Signal Jump", "Wrong Lane"];
const classes: VehicleClass[] = ["Motorcycle", "Car", "Truck", "Bus", "Auto-rickshaw"];
const statuses: ViolationStatus[] = ["Pending", "Verified", "Dismissed", "Notified"];
const locations = ["MG Road Jn.", "Hi-Tec City", "Banjara Hills", "Kondapur Jn.", "Gachibowli Flyover", "Madhapur"];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randomPlate() {
  const states = ["TS", "AP", "KA", "MH", "DL"];
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  return `${rand(states)}${String(Math.floor(10 + Math.random() * 89))}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}${String(Math.floor(1000 + Math.random() * 8999))}`;
}

export const violations: Violation[] = Array.from({ length: 48 }).map((_, i) => {
  const d = new Date(Date.now() - i * 1000 * 60 * 47);
  return {
    id: `VIO-${String(10234 + i)}`,
    type: rand(types),
    vehicleClass: rand(classes),
    plate: randomPlate(),
    confidence: Math.round((0.72 + Math.random() * 0.27) * 100) / 100,
    timestamp: d.toISOString(),
    status: rand(statuses),
    location: rand(locations),
  };
});

export const stats = {
  totalViolations: 12847,
  helmet: 4923,
  tripleRiding: 1872,
  illegalParking: 3214,
  ocrSuccessRate: 0.962,
  detectionAccuracy: 0.947,
};

export const violationsByType = types.map((t) => ({
  name: t,
  count: violations.filter((v) => v.type === t).length * 187 + Math.floor(Math.random() * 500),
}));

export const dailyTrends = Array.from({ length: 14 }).map((_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (13 - i));
  return {
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    helmet: 120 + Math.floor(Math.random() * 220),
    parking: 80 + Math.floor(Math.random() * 180),
    triple: 30 + Math.floor(Math.random() * 110),
  };
});

export const vehicleDistribution = classes.map((c) => ({
  name: c,
  value: 100 + Math.floor(Math.random() * 500),
}));

export const ocrAccuracy = Array.from({ length: 12 }).map((_, i) => ({
  hour: `${String(i * 2).padStart(2, "0")}:00`,
  accuracy: 88 + Math.random() * 10,
}));

export const detectionPerf = Array.from({ length: 7 }).map((_, i) => ({
  day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
  precision: 90 + Math.random() * 8,
  recall: 87 + Math.random() * 10,
}));
