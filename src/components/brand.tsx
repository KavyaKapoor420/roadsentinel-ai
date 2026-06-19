import { Link } from "@tanstack/react-router";

export function Brand({ className }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className ?? ""}`}>
      <span className="text-xl font-light tracking-tight text-muted-foreground">
        traffic<span className="font-extrabold text-primary">vision</span>
      </span>
    </Link>
  );
}
