import { Link, useRouterState } from "@tanstack/react-router";
import { FiGrid, FiUploadCloud, FiCheckSquare, FiBarChart2, FiFileText, FiSettings, FiLogOut, FiBell, FiMenu } from "react-icons/fi";
import { Brand } from "./brand";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: FiGrid },
  { to: "/upload", label: "Upload Detection", icon: FiUploadCloud },
  { to: "/violations", label: "Violations", icon: FiCheckSquare },
  { to: "/analytics", label: "Analytics", icon: FiBarChart2 },
  { to: "/reports", label: "Reports", icon: FiFileText },
  { to: "/settings", label: "Settings", icon: FiSettings },
] as const;

export function AppShell({ title, subtitle, children, actions }: { title: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-grid ambient-glow">
      <div className="relative z-10 flex">
        {/* Floating Sidebar (Desktop Only) */}
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col glass-panel-dense lg:flex m-4 mr-0">
          <div className="px-6 py-5"><Brand /></div>
          <nav className="flex-1 space-y-1.5 px-3 py-2">
            {nav.map(({ to, label, icon: Icon }) => {
              const active = pathname === to || pathname.startsWith(to + "/");
              return (
                <Link
                  key={to}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 border border-transparent",
                    active
                      ? "bg-primary/20 text-foreground border-primary/35 shadow-[0_0_16px_-4px_var(--glow-primary)]"
                      : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground hover:border-white/[0.04]"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-white/[0.06] p-3">
            <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-white/[0.06] hover:text-foreground border border-transparent hover:border-white/[0.04]">
              <FiLogOut className="h-4 w-4" /> Sign out
            </Link>
          </div>
        </aside>

        {/* Content Area */}
        <main className="min-w-0 flex-1 flex flex-col p-4 lg:p-6 space-y-4 lg:space-y-6">
          {/* Header containing both Title and Mobile Trigger */}
          <header className="flex items-center justify-between border border-white/[0.08] bg-white/[0.02] backdrop-blur-xl rounded-2xl px-6 py-4 shadow-[0_8px_32px_oklch(0_0_0/0.25)]">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Navigation Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]">
                    <FiMenu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 border-r border-white/[0.12] bg-zinc-950/95 backdrop-blur-2xl">
                  <div className="flex h-full flex-col">
                    <div className="px-6 py-5 border-b border-white/[0.06]"><Brand /></div>
                    <nav className="flex-1 space-y-1.5 px-3 py-4">
                      {nav.map(({ to, label, icon: Icon }) => {
                        const active = pathname === to || pathname.startsWith(to + "/");
                        return (
                          <Link
                            key={to}
                            to={to}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 border border-transparent",
                              active
                                ? "bg-primary/20 text-foreground border-primary/35 shadow-[0_0_16px_-4px_var(--glow-primary)]"
                                : "text-muted-foreground hover:bg-white/[0.06] hover:text-foreground hover:border-white/[0.04]"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            {label}
                          </Link>
                        );
                      })}
                    </nav>
                    <div className="border-t border-white/[0.06] p-3">
                      <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-200 hover:bg-white/[0.06] hover:text-foreground border border-transparent hover:border-white/[0.04]">
                        <FiLogOut className="h-4 w-4" /> Sign out
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold tracking-tight">{title}</h1>
                {subtitle && <p className="truncate text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {actions}
              <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl border border-transparent hover:border-white/[0.06] hover:bg-white/[0.04]">
                <FiBell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-accent" />
              </Button>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground shadow-[0_0_16px_-4px_var(--glow-primary)] border border-white/[0.12]">OD</div>
            </div>
          </header>
          <div className="flex-1 min-h-0">{children}</div>
        </main>
      </div>
    </div>
  );
}
