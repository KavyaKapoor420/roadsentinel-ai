import { Link } from "@tanstack/react-router";
import { Brand } from "./brand";
import { Button } from "@/components/ui/button";

export function SiteNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Brand />
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="/#features" className="transition-colors hover:text-foreground">Features</a>
          <Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link>
          <a href="/#docs" className="transition-colors hover:text-foreground">Documentation</a>
          <a href="/#faq" className="transition-colors hover:text-foreground">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link to="/login">Login</Link></Button>
          <Button asChild size="sm"><Link to="/register">Sign Up</Link></Button>
        </div>
      </div>
    </header>
  );
}
