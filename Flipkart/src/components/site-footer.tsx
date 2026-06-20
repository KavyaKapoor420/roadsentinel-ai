import { Brand } from "./brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] glass-nav">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="space-y-3">
          <Brand />
          <p className="text-sm text-muted-foreground max-w-xs">
            Enterprise AI for traffic enforcement. Detect, verify and report violations in real time.
          </p>
        </div>
        <FooterCol title="Product" items={["Features", "Dashboard", "API", "Changelog"]} />
        <FooterCol title="Company" items={["About", "Customers", "Careers", "Contact"]} />
        <FooterCol title="Legal" items={["Privacy", "Terms", "Security", "DPA"]} />
      </div>
      <div className="border-t border-white/[0.06]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} TrafficVision AI</span>
          <span>Built for traffic enforcement teams.</span>
        </div>
      </div>
    </footer>
  );
}
function FooterCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((i) => <li key={i}><a href="#" className="transition-all duration-200 hover:text-foreground">{i}</a></li>)}
      </ul>
    </div>
  );
}
