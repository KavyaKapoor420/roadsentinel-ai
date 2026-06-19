import { Brand } from "./brand";
import { Twitter, Linkedin, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 py-12">
        <Brand />
        <div className="flex items-center gap-3">
          {[Twitter, Linkedin, Mail].map((Icon, i) => (
            <a
              key={i}
              href="#"
              className="grid h-9 w-9 place-items-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} TrafficVision AI · Built for traffic enforcement teams
        </p>
      </div>
    </footer>
  );
}
