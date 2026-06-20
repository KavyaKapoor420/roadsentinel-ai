import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

export function StatCard({ label, value, delta, icon: Icon, tone = "primary" }: {
  label: string; value: string | number; delta?: string; icon: LucideIcon; tone?: "primary" | "accent" | "success" | "destructive";
}) {
  const toneMap: Record<string, string> = {
    primary: "bg-primary/15 text-primary ring-primary/30",
    accent: "bg-accent/15 text-accent ring-accent/30",
    success: "bg-emerald-500/15 text-emerald-400 ring-emerald-500/30",
    destructive: "bg-destructive/15 text-destructive ring-destructive/30",
  };
  return (
    <Card className="relative overflow-hidden p-6 glass-hover">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {delta && (
            <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-400">
              <ArrowUpRight className="h-3 w-3" /> {delta}
            </p>
          )}
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}
