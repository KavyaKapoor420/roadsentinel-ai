import { Link } from "@tanstack/react-router";
import { Brand } from "./brand";
import { Moon } from "lucide-react";

export function SiteNavbar() {
  return (
    <header className="absolute top-0 z-40 w-full">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 md:px-10">
        <Brand />
        <div className="flex items-center gap-5">
          <Link to="/login" className="text-sm font-semibold text-foreground transition-colors hover:text-primary">
            Sign In
          </Link>
          <button
            aria-label="Toggle theme"
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
          >
            <Moon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
