import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { UploadCloud, FileVideo, Image as ImageIcon, X } from "lucide-react";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/services/api";
import { toast } from "sonner";
import type { Violation } from "@/lib/mockData";

export const Route = createFileRoute("/upload")({
  head: () => ({ meta: [{ title: "Upload detection — TrafficVision AI" }] }),
  component: Upload,
});

function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
  const [detections, setDetections] = useState<Violation[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function onPick(f: File | null) {
    setFile(f);
    setDetections([]);
    setProgress(0);
    setStatus("idle");
    setError(null);
  }

  async function start() {
    if (!file) return;
    setStatus("processing");
    setDetections([]);
    setProgress(0);
    setError(null);

    try {
      const isVideo = file.type.startsWith("video");
      const results = isVideo
        ? await api.analyzeVideo(file, setProgress)
        : await api.analyzeImage(file, setProgress);

      setDetections(results);
      setStatus("done");
      await queryClient.invalidateQueries({ queryKey: ["violations"] });
      await queryClient.invalidateQueries({ queryKey: ["stats"] });
      await queryClient.invalidateQueries({ queryKey: ["analytics"] });

      if (results.length === 0) {
        toast.info("Analysis complete — no violations detected.");
      } else {
        toast.success(`Found ${results.length} violation${results.length === 1 ? "" : "s"}.`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Analysis failed";
      setError(msg);
      setStatus("error");
      toast.error(msg);
    }
  }

  return (
    <AppShell title="Upload & detect" subtitle="Run detection on images or video via the backend API.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              onPick(e.dataTransfer.files?.[0] ?? null);
            }}
            className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] p-10 text-center transition-colors hover:border-primary/40 hover:bg-white/[0.06]"
          >
            <UploadCloud className="h-10 w-10 text-primary" />
            <p className="mt-3 text-sm font-semibold">Drag & drop a file here</p>
            <p className="text-xs text-muted-foreground">PNG, JPG, MP4 — up to 500MB</p>
            <input ref={inputRef} type="file" hidden accept="image/*,video/*" onChange={(e) => onPick(e.target.files?.[0] ?? null)} />
            <Button onClick={() => inputRef.current?.click()} variant="outline" size="sm" className="mt-4">
              Browse files
            </Button>
          </div>

          {file && (
            <div className="mt-5 flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.04] p-3">
              <div className="flex items-center gap-3">
                {file.type.startsWith("video") ? (
                  <FileVideo className="h-5 w-5 text-primary" />
                ) : (
                  <ImageIcon className="h-5 w-5 text-primary" />
                )}
                <div>
                  <p className="text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={start} disabled={status === "processing"} size="sm">
                  {status === "processing" ? "Processing…" : "Start detection"}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onPick(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {status !== "idle" && (
            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {status === "done"
                    ? "Detection complete"
                    : status === "error"
                      ? "Detection failed"
                      : "Analyzing with backend…"}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
              {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
            </div>
          )}

          {status === "done" && detections.length > 0 && (
            <div className="mt-4 flex gap-2">
              <Button size="sm" onClick={() => navigate({ to: "/violations" })}>
                View violations list
              </Button>
              <Button size="sm" variant="outline" onClick={() => navigate({ to: "/dashboard" })}>
                Open dashboard
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-semibold">Detected violations</h3>
          <p className="text-xs text-muted-foreground">Results from {file?.type.startsWith("video") ? "video" : "image"} analysis</p>
          <ul className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
            {detections.length === 0 && (
              <li className="text-sm text-muted-foreground">
                {status === "processing" ? "Waiting for backend response…" : "Detections will appear here after analysis."}
              </li>
            )}
            {detections.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-white/[0.04] px-3 py-2 text-sm"
              >
                <div>
                  <span>{d.type}</span>
                  {d.plate !== "—" && <p className="font-mono text-xs text-muted-foreground">{d.plate}</p>}
                </div>
                <Badge variant="secondary">{(d.confidence * 100).toFixed(0)}%</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </AppShell>
  );
}
