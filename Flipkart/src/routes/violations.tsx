import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { useMemo, useState } from "react";
import { Eye, Search } from "lucide-react";

export const Route = createFileRoute("/violations")({
  head: () => ({ meta: [{ title: "Violations — TrafficVision AI" }] }),
  component: ViolationsPage,
});

function ViolationsPage() {
  const { data } = useQuery({ queryKey: ["violations"], queryFn: api.getViolations });
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [vehicle, setVehicle] = useState("all");
  const [minConf, setMinConf] = useState([70]);

  const filtered = useMemo(() => {
    return (data ?? []).filter((v) => {
      if (type !== "all" && v.type !== type) return false;
      if (vehicle !== "all" && v.vehicleClass !== vehicle) return false;
      if (v.confidence * 100 < minConf[0]) return false;
      if (search && !`${v.id} ${v.plate} ${v.location}`.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [data, type, vehicle, minConf, search]);

  return (
    <AppShell title="Violations" subtitle={`${filtered.length} of ${data?.length ?? 0} records`}>
      <Card className="p-4">
        <div className="grid gap-3 md:grid-cols-5">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search ID, plate, location…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {["Helmet", "Triple Riding", "Illegal Parking", "Signal Jump", "Wrong Lane"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={vehicle} onValueChange={setVehicle}>
            <SelectTrigger><SelectValue placeholder="Vehicle" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All vehicles</SelectItem>
              {["Motorcycle", "Car", "Truck", "Bus", "Auto-rickshaw"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Min conf</span>
            <Slider value={minConf} max={100} step={1} onValueChange={setMinConf} />
            <span className="w-10 text-right text-xs">{minConf[0]}%</span>
          </div>
        </div>
      </Card>

      <Card className="mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                {["ID", "Type", "Vehicle", "Plate", "Confidence", "Timestamp", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v) => (
                <tr key={v.id} className="border-t border-white/[0.06] transition-all duration-200 hover:bg-white/[0.04]">
                  <td className="px-4 py-3 font-mono text-xs">{v.id}</td>
                  <td className="px-4 py-3">{v.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.vehicleClass}</td>
                  <td className="px-4 py-3 font-mono">{v.plate}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full bg-primary" style={{ width: `${v.confidence * 100}%` }} />
                      </div>
                      <span className="text-xs">{(v.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(v.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-4 py-3">
                    <Button asChild size="sm" variant="ghost"><Link to="/evidence/$id" params={{ id: v.id }}><Eye className="mr-2 h-3.5 w-3.5" />View</Link></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-amber-500/15 text-amber-400 ring-amber-500/30",
    Verified: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    Dismissed: "bg-muted text-muted-foreground ring-border",
    Notified: "bg-primary/15 text-primary ring-primary/30",
  };
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ring-1 ${map[status]}`}>{status}</span>;
}
