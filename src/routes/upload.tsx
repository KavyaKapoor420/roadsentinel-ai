import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileVideo, Image as ImageIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { connectDetection, type DetectionEvent } from "@/services/websocket";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload detection — TrafficVision AI" }] }),
  component: Upload,
});

interface Detection { label: string; confidence: number }

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done">("idle");
  const [detections, setDetections] = useState<Detection[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const stopRef = useRef<(() => void) | null>(null);

  function onPick(f: File | null) {
    setFile(f); setDetections([]); setProgress(0); setStatus("idle");
  }

  function start() {
    if (!file) return;
    setStatus("processing");
    setDetections([]);
    setProgress(0);
    stopRef.current?.();
    stopRef.current = connectDetection((e: DetectionEvent) => {
      if (e.type === "progress") setProgress(e.progress);
      else if (e.type === "detection") setDetections((d) => [...d, { label: e.label, confidence: e.confidence }]);
      else if (e.type === "complete") setStatus("done");
    });
  }

  useEffect(() => () => stopRef.current?.(), []);

  return (
    <AppShell title="Upload & detect" subtitle="Run detection on images or video. Live updates over WebSocket.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/60 p-6 lg:col-span-2">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onPick(e.dataTransfer.files?.[0] ?? null); }}
            className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-border bg-background/40 p-10 text-center transition-colors hover:border-primary/40"
          >
            <UploadCloud className="h-10 w-10 text-primary" />
            <p className="mt-3 text-sm font-semibold">Drag & drop a file here</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, MP4 — up to 500MB</p>
            <input ref={inputRef} type="file" hidden accept="image/*,video/*" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
            <Button onClick={() => inputRef.current?.click()} variant="outline" size="sm" className="mt-4">Browse files</Button>
          </div>

          {file && (
            <div className="mt-5 flex items-center justify-between rounded-lg border border-border/60 bg-background/40 p-3">
              <div className="flex items-center gap-3">
                {file.type.startsWith("video") ? <FileVideo className="h-5 w-5 text-primary" /> : <ImageIcon className="h-5 w-5 text-primary" />}
                <div>
                  <p className="text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={start} disabled={status === "processing"} size="sm">{status === "processing" ? "Processing…" : "Start detection"}</Button>
                <Button variant="ghost" size="icon" onClick={() => onPick(null)}><X className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {status !== "idle" && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>{status === "done" ? "Detection complete" : "Live processing"}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </Card>

        <Card className="border-border/60 bg-card/60 p-6">
          <h3 className="text-sm font-semibold">Live detections</h3>
          <p className="text-xs text-muted-foreground">Streamed via WebSocket</p>
          <ul className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
            {detections.length === 0 && <li className="text-sm text-muted-foreground">Detections will appear here in real time.</li>}
            {detections.map((d, i) => (
              <li key={i} className="flex items-center justify-between rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm">
                <span>{d.label}</span>
                <Badge variant="secondary">{(d.confidence * 100).toFixed(0)}%</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
