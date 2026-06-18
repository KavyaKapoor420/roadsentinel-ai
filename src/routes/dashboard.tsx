import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { StatCard } from "@/components/stat-card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { ShieldAlert, HardHat, Users, ParkingSquare, ScanLine, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — TrafficVision AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({ queryKey: ["stats"], queryFn: api.getStats });
  const analytics = useQuery({ queryKey: ["analytics"], queryFn: api.getAnalytics });
  const violations = useQuery({ queryKey: ["violations"], queryFn: api.getViolations });

  const s = stats.data;
  return (
    <AppShell title="Operations overview" subtitle="Live across all connected cameras"
      actions={<Button asChild size="sm"><Link to="/upload">New detection</Link></Button>}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard label="Total violations" value={s?.totalViolations.toLocaleString() ?? "—"} delta="+12.4%" icon={ShieldAlert} tone="primary" />
        <StatCard label="Helmet" value={s?.helmet.toLocaleString() ?? "—"} delta="+4.1%" icon={HardHat} tone="accent" />
        <StatCard label="Triple riding" value={s?.tripleRiding.toLocaleString() ?? "—"} delta="+2.0%" icon={Users} tone="destructive" />
        <StatCard label="Illegal parking" value={s?.illegalParking.toLocaleString() ?? "—"} delta="+7.8%" icon={ParkingSquare} tone="accent" />
        <StatCard label="OCR success" value={s ? `${(s.ocrSuccessRate * 100).toFixed(1)}%` : "—"} icon={ScanLine} tone="success" />
        <StatCard label="Detection acc." value={s ? `${(s.detectionAccuracy * 100).toFixed(1)}%` : "—"} icon={Target} tone="success" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="border-border/60 bg-card/60 p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Daily trends</h3>
              <p className="text-xs text-muted-foreground">Last 14 days, by category</p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={analytics.data?.dailyTrends ?? []}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Area type="monotone" dataKey="helmet" stroke="var(--color-chart-1)" fill="url(#g1)" />
                <Area type="monotone" dataKey="parking" stroke="var(--color-chart-2)" fill="url(#g2)" />
                <Area type="monotone" dataKey="triple" stroke="var(--color-chart-3)" fill="url(#g3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="border-border/60 bg-card/60 p-5">
          <h3 className="text-sm font-semibold">Violations by type</h3>
          <p className="text-xs text-muted-foreground">All time</p>
          <div className="mt-2 h-72">
            <ResponsiveContainer>
              <BarChart data={analytics.data?.violationsByType ?? []}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={10} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8 }} />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="mt-6 border-border/60 bg-card/60 p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Recent violations</h3>
            <p className="text-xs text-muted-foreground">Most recent detections across feeds</p>
          </div>
          <Button asChild variant="outline" size="sm"><Link to="/violations">View all</Link></Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr className="border-b border-border/60">
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Plate</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Conf.</th>
                <th className="px-3 py-2 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {(violations.data ?? []).slice(0, 7).map((v) => (
                <tr key={v.id} className="border-b border-border/40">
                  <td className="px-3 py-2 font-mono text-xs"><Link to="/evidence/$id" params={{ id: v.id }} className="hover:text-primary">{v.id}</Link></td>
                  <td className="px-3 py-2">{v.type}</td>
                  <td className="px-3 py-2 font-mono">{v.plate}</td>
                  <td className="px-3 py-2">{v.location}</td>
                  <td className="px-3 py-2">{(v.confidence * 100).toFixed(0)}%</td>
                  <td className="px-3 py-2 text-muted-foreground">{new Date(v.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
