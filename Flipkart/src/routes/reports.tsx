import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { useState } from "react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — TrafficVision AI" }] }),
  component: Reports,
});

function Reports() {
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const today = new Date().toISOString().slice(0, 10);
  const monthAgo = new Date(Date.now() - 30 * 86400 * 1000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(monthAgo);
  const [to, setTo] = useState(today);

  async function gen(format: "csv" | "pdf") {
    const r = await api.generateReport({ from, to, format });
    toast.success(`Report ready: ${r.filename}`);
  }

  return (
    <AppShell title="Reports" subtitle="Generate violation and performance reports">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { k: (stats?.totalViolations ?? 0).toLocaleString(), v: "Violations in period" },
          { k: "—", v: "Cameras reporting" },
          { k: stats ? `${(stats.detectionAccuracy * 100).toFixed(1)}%` : "—", v: "Accuracy" },
          { k: stats ? `${(stats.ocrSuccessRate * 100).toFixed(1)}%` : "—", v: "OCR success" },
        ].map((s) => (
          <Card key={s.v} className="p-5">
            <div className="text-2xl font-semibold tracking-tight">{s.k}</div>
            <div className="mt-1 text-xs text-muted-foreground">{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6">
        <h3 className="text-sm font-semibold">Generate report</h3>
        <p className="text-xs text-muted-foreground">Pick a date range and export format.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="space-y-1.5"><Label htmlFor="from">From</Label><Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></div>
          <div className="space-y-1.5"><Label htmlFor="to">To</Label><Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} /></div>
          <div className="flex items-end gap-2">
            <Button onClick={() => gen("csv")} variant="outline" className="flex-1"><FileSpreadsheet className="mr-2 h-4 w-4" />Export CSV</Button>
            <Button onClick={() => gen("pdf")} className="flex-1"><FileDown className="mr-2 h-4 w-4" />Export PDF</Button>
          </div>
        </div>
      </Card>

      <Card className="mt-4 p-6">
        <h3 className="text-sm font-semibold">Recent reports</h3>
        <ul className="mt-3 divide-y divide-white/[0.06] text-sm">
          {["October-2026-summary.pdf", "Helmet-Q3.csv", "Hi-Tec-City-weekly.pdf"].map((f) => (
            <li key={f} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3"><FileText className="h-4 w-4 text-primary" /><span>{f}</span></div>
              <Button variant="ghost" size="sm"><FileDown className="mr-2 h-4 w-4" />Download</Button>
            </li>
          ))}
        </ul>
      </Card>
    </AppShell>
  );
}
