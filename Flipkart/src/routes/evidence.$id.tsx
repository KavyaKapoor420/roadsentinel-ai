import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Download, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/evidence/$id")({
  head: ({ params }) => ({ meta: [{ title: `Evidence ${params.id} — TrafficVision AI` }] }),
  component: Evidence,
  notFoundComponent: () => <div className="p-10 text-center">Evidence not found.</div>,
});

function Evidence() {
  const { id } = Route.useParams();
  const { data: v, isLoading } = useQuery({ queryKey: ["violation", id], queryFn: () => api.getViolation(id) });
  if (!isLoading && !v) throw notFound();

  return (
    <AppShell title={`Evidence ${id}`} subtitle="Annotated detection, OCR results and metadata"
      actions={
        <>
          <Button asChild variant="ghost" size="sm"><Link to="/violations"><ArrowLeft className="mr-2 h-4 w-4" />Back</Link></Button>
          <Button size="sm"><Download className="mr-2 h-4 w-4" />Download evidence</Button>
        </>
      }>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-gradient-to-br from-secondary to-background ring-1 ring-border">
            {v?.imageUrl ? (
              <img src={v.imageUrl} alt="Annotated detection" className="h-full w-full object-contain" />
            ) : (
              <>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,oklch(0.3_0.05_260)_0%,transparent_60%)]" />
                {v?.bbox && (
                  <div
                    className="absolute rounded-md border-2 border-primary/80 shadow-[0_0_30px_oklch(0.65_0.21_255/0.5)]"
                    style={{
                      left: `${(v.bbox[0] / 1920) * 100}%`,
                      top: `${(v.bbox[1] / 1080) * 100}%`,
                      width: `${((v.bbox[2] - v.bbox[0]) / 1920) * 100}%`,
                      height: `${((v.bbox[3] - v.bbox[1]) / 1080) * 100}%`,
                    }}
                  >
                    <span className="absolute -top-6 left-0 rounded bg-primary px-2 py-0.5 text-xs font-mono text-primary-foreground">
                      {v.type} · {v.confidence.toFixed(2)}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Violation details</h3>
            <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <Row k="Type" v={v?.type} />
              <Row k="Vehicle" v={v?.vehicleClass} />
              <Row k="Plate" v={v?.plate} mono />
              <Row k="Confidence" v={v ? `${(v.confidence * 100).toFixed(0)}%` : "—"} />
              <Row k="Location" v={v?.location} />
              <Row k="Status" v={v?.status ?? "—"} />
            </dl>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold">OCR results</h3>
            <div className="mt-3 rounded-lg border border-white/[0.08] bg-white/[0.04] p-3 font-mono text-sm backdrop-blur-md">
              <div className="flex items-center justify-between"><span>{v?.plate ?? "—"}</span><Badge variant="secondary">96.4%</Badge></div>
              <p className="mt-2 text-xs text-muted-foreground">Recognized via ANPR pipeline · 2 candidates rejected</p>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold">Metadata</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row k="Captured" v={v ? new Date(v.timestamp).toLocaleString() : "—"} />
              <Row k="Camera" v="CAM-08 · Hi-Tec City" />
              <Row k="Model" v="tv-yolov8x v2.4" mono />
              <Row k="Hash" v="0xa3f1…b29d" mono />
            </dl>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v, mono }: { k: string; v?: string | number; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className={mono ? "font-mono" : ""}>{v ?? "—"}</dd>
    </div>
  );
}
