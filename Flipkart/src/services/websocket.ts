/**
 * WebSocket service for live stream analysis.
 * Connects to WS /api/analyze/stream on the backend.
 */
export type DetectionEvent =
  | { type: "progress"; progress: number; message: string }
  | { type: "detection"; label: string; confidence: number; bbox: [number, number, number, number] }
  | { type: "complete"; total: number }
  | { type: "error"; error: string };

function getWsUrl(): string {
  const env = (import.meta as { env?: { VITE_WS_URL?: string } }).env;
  if (env?.VITE_WS_URL) return env.VITE_WS_URL;
  if (typeof window !== "undefined") {
    const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
    return `${proto}//${window.location.host}/api/analyze/stream`;
  }
  return "wss://fgr2-backend.mooo.com/api/analyze/stream";
}

export const WS_URL = getWsUrl();

export function connectStream(
  streamUrl: string,
  onEvent: (e: DetectionEvent) => void,
  stride = 5,
): () => void {
  const ws = new WebSocket(getWsUrl());
  let total = 0;

  ws.onopen = () => {
    onEvent({ type: "progress", progress: 5, message: "Connecting to stream…" });
    ws.send(JSON.stringify({ stream_url: streamUrl, stride }));
  };

  ws.onmessage = (m) => {
    try {
      const data = JSON.parse(m.data as string) as Record<string, unknown>;
      if (data.error) {
        onEvent({ type: "error", error: String(data.error) });
        return;
      }
      if (data.status === "connecting") {
        onEvent({ type: "progress", progress: 20, message: "Connecting to camera…" });
        return;
      }
      if (data.status === "streaming") {
        onEvent({ type: "progress", progress: 40, message: "Live streaming…" });
        return;
      }
      if (data.status === "stream_ended") {
        onEvent({ type: "complete", total });
        return;
      }
      if (Array.isArray(data.violations)) {
        for (const v of data.violations as Array<{ type: string; confidence: number; bbox: number[] }>) {
          total += 1;
          onEvent({
            type: "detection",
            label: v.type,
            confidence: v.confidence,
            bbox: v.bbox as [number, number, number, number],
          });
        }
        onEvent({ type: "progress", progress: Math.min(95, 40 + total * 5), message: "Detecting…" });
      }
    } catch {
      /* ignore malformed messages */
    }
  };

  ws.onerror = () => onEvent({ type: "error", error: "WebSocket connection failed" });
  ws.onclose = () => onEvent({ type: "complete", total });

  return () => {
    if (ws.readyState === WebSocket.OPEN) ws.send("stop");
    ws.close();
  };
}

/** @deprecated Use connectStream for live RTSP feeds. Kept for compatibility. */
export function connectDetection(onEvent: (e: DetectionEvent) => void) {
  return connectStream("rtsp://localhost/stream", onEvent);
}
