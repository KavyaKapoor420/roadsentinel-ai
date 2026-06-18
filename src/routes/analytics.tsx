import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics — TrafficVision AI" }] }),
  component: Analytics,
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function Analytics() {
  const { data } = useQuery({ queryKey: ["analytics"], queryFn: api.getAnalytics });

  return (
    <AppShell title="Analytics" subtitle="Detection performance, trends and distributions">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Violations by type">
          <BarChart data={data?.violationsByType ?? []}>
            <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {(data?.violationsByType ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ChartCard>

        <ChartCard title="Daily trends">
          <AreaChart data={data?.dailyTrends ?? []}>
            <defs>
              <linearGradient id="ah" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
            <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="helmet" stroke="var(--color-chart-1)" fill="url(#ah)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Vehicle distribution">
          <PieChart>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Pie data={data?.vehicleDistribution ?? []} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
              {(data?.vehicleDistribution ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
          </PieChart>
        </ChartCard>

        <ChartCard title="OCR accuracy (24h)">
          <LineChart data={data?.ocrAccuracy ?? []}>
            <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
            <XAxis dataKey="hour" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis domain={[80, 100]} stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="accuracy" stroke="var(--color-chart-3)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <Card className="border-border/60 bg-card/60 p-5 lg:col-span-2">
          <h3 className="text-sm font-semibold">Detection performance</h3>
          <p className="text-xs text-muted-foreground">Weekly precision vs recall</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={data?.detectionPerf ?? []}>
                <CartesianGrid stroke="oklch(1 0 0 / 0.05)" />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis domain={[80, 100]} stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="precision" fill="var(--color-chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="recall" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}

const tooltipStyle = { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 } as const;

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <Card className="border-border/60 bg-card/60 p-5">
      <h3 className="text-sm font-semibold">{title}</h3>
      <div className="mt-3 h-72"><ResponsiveContainer>{children}</ResponsiveContainer></div>
    </Card>
  );
}
