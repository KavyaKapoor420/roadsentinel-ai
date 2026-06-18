/**
 * WebSocket service with a swap point.
 * MOCK = true emits simulated detection events; switch to real WS by
 * connecting `new WebSocket(WS_URL)` and forwarding messages.
 */
export type DetectionEvent =
  | { type: "progress"; progress: number; message: string }
  | { type: "detection"; label: string; confidence: number; bbox: [number, number, number, number] }
  | { type: "complete"; total: number }
  | { type: "error"; error: string };

const MOCK = true;
export const WS_URL = (import.meta as { env?: { VITE_WS_URL?: string } }).env?.VITE_WS_URL ?? "wss://example.com/ws";

export function connectDetection(onEvent: (e: DetectionEvent) => void) {
  if (MOCK) {
    let p = 0;
    const labels = ["Helmet missing", "Triple riding", "Plate detected", "Signal jump"];
    const id = setInterval(() => {
      p += 8 + Math.random() * 10;
      if (p < 100) {
        onEvent({ type: "progress", progress: Math.min(99, p), message: "Analyzing frame…" });
        if (Math.random() > 0.4) {
          onEvent({
            type: "detection",
            label: labels[Math.floor(Math.random() * labels.length)],
            confidence: Math.round((0.7 + Math.random() * 0.29) * 100) / 100,
            bbox: [Math.random() * 0.4, Math.random() * 0.4, 0.2 + Math.random() * 0.3, 0.2 + Math.random() * 0.3],
          });
        }
      } else {
        onEvent({ type: "progress", progress: 100, message: "Done" });
        onEvent({ type: "complete", total: 6 + Math.floor(Math.random() * 12) });
        clearInterval(id);
      }
    }, 600);
    return () => clearInterval(id);
  }
  const ws = new WebSocket(WS_URL);
  ws.onmessage = (m) => {
    try { onEvent(JSON.parse(m.data) as DetectionEvent); } catch { /* noop */ }
  };
  return () => ws.close();
}
