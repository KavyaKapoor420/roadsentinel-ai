import { Link } from "@tanstack/react-router";

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30 shadow-[0_0_16px_-4px_var(--glow-primary)]">
        <span className="absolute inset-1 rounded-md bg-gradient-to-br from-primary to-accent opacity-80" />
        <span className="relative h-2 w-2 rounded-full bg-background" />
      </span>
      <span className="text-base font-semibold tracking-tight">
        TrafficVision <span className="text-primary">AI</span>
      </span>
    </Link>
  );
}
