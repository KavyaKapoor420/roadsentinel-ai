import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Cpu, Camera, Gauge, Workflow, Database, BarChart3, Upload, Play, ScanLine, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrafficVision AI — Real-time traffic violation detection" },
      { name: "description", content: "Detect helmet violations, triple riding, illegal parking and more with AI. ANPR, live analytics, and enterprise-grade reporting." },
      { property: "og:title", content: "TrafficVision AI" },
      { property: "og:description", content: "AI-powered traffic violation detection platform with real-time analytics." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNavbar />
      <Hero />
      <Overview />
      <Features />
      <HowItWorks />
      <Architecture />
      <AnalyticsShowcase />
      <DemoWorkflow />
      <FAQ />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-grid bg-grid-fade">
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-20 text-center">
        <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> New: Live ANPR streaming dashboard is now available
        </Link>
        <h1 className="mx-auto mt-7 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          <span className="text-foreground">Detect every</span>{" "}
          <span className="relative inline-block">
            <span className="text-gradient">traffic violation</span>
          </span>
          <br />
          <span className="text-muted-foreground">in real time, at city scale.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          TrafficVision AI analyses live camera feeds and uploaded footage to flag helmet violations,
          triple riding, illegal parking and signal jumps — with automatic plate recognition and
          court-ready evidence packs.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="glow-primary"><Link to="/dashboard"><Play className="mr-2 h-4 w-4" />Open Dashboard</Link></Button>
          <Button asChild variant="outline" size="lg"><Link to="/upload"><Upload className="mr-2 h-4 w-4" />Try Detection</Link></Button>
        </div>
        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { k: "12.8K+", v: "Violations / day" },
            { k: "96.2%", v: "OCR success" },
            { k: "94.7%", v: "Detection accuracy" },
            { k: "180ms", v: "Avg. inference" },
          ].map((s) => (
            <div key={s.v} className="rounded-xl border border-border/60 bg-card/40 p-4 backdrop-blur">
              <div className="text-2xl font-semibold tracking-tight">{s.k}</div>
              <div className="text-xs text-muted-foreground">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Overview() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary">Product overview</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">One platform. Every camera. Every violation.</h2>
            <p className="mt-4 text-muted-foreground">
              Connect existing CCTV, body-cams or upload recordings. Our vision models run real-time
              detection, classify vehicle types, run ANPR/OCR on the plate, and create
              tamper-evident evidence packs that integrate with your enforcement workflow.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, t: "Compliance-ready", d: "Audit logs, role-based access, SOC2-aligned controls." },
              { icon: Cpu, t: "On-prem or cloud", d: "Run inference on your edge GPUs or our hosted gateway." },
              { icon: Camera, t: "Multi-camera", d: "RTSP, ONVIF and HLS streams. Auto-failover." },
              { icon: Gauge, t: "Fast", d: "Sub-200ms detection with batched GPU inference." },
            ].map(({ icon: Icon, t, d }) => (
              <Card key={t} className="border-border/60 bg-card/60 p-4">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-3 text-sm font-semibold">{t}</p>
                <p className="text-xs text-muted-foreground">{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Features() {
  const items = [
    { icon: ShieldCheck, t: "Helmet violation", d: "Detect helmetless riders & pillions in real time across multi-lane feeds." },
    { icon: AlertTriangle, t: "Triple riding", d: "Identify overloaded two-wheelers and flag automatically with confidence scores." },
    { icon: ScanLine, t: "ANPR / OCR", d: "Plate recognition tuned for Indian formats with 96%+ success rate." },
    { icon: Workflow, t: "Illegal parking", d: "Zone-based parking violations using polygon geofences." },
    { icon: BarChart3, t: "Analytics", d: "Heatmaps, time-of-day trends, repeat-offender clustering." },
    { icon: Database, t: "Evidence vault", d: "Annotated images, metadata and chain-of-custody exports." },
  ];
  return (
    <section id="features" className="bg-grid">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Capabilities" title="Built for enforcement teams" subtitle="Every detection comes with explainable evidence." />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon: Icon, t, d }) => (
            <Card key={t} className="border-border/60 bg-card/60 p-6 transition-colors hover:border-primary/40">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 ring-1 ring-primary/30"><Icon className="h-5 w-5 text-primary" /></span>
              <h3 className="mt-4 text-lg font-semibold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { n: "01", t: "Ingest", d: "Pull RTSP/ONVIF feeds or upload footage. Auto-thumbnails and chunked decode." },
    { n: "02", t: "Detect", d: "YOLO-class models classify vehicles, riders and violations frame by frame." },
    { n: "03", t: "Verify", d: "ANPR + human-in-the-loop review queue. Evidence pack auto-generated." },
    { n: "04", t: "Notify", d: "Push to enforcement systems, send SMS/notice to violators, export to court." },
  ];
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="How it works" title="From frame to enforcement in seconds" />
        <ol className="grid gap-4 md:grid-cols-4">
          {steps.map((s) => (
            <li key={s.n} className="rounded-2xl border border-border/60 bg-card/60 p-6">
              <div className="text-xs font-mono text-primary">{s.n}</div>
              <div className="mt-2 text-lg font-semibold">{s.t}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section className="bg-grid">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Architecture" title="Edge inference. Central analytics." />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "Edge nodes", d: "GPU workers running optimized vision models on-site." },
            { t: "Streaming gateway", d: "WebSocket pipeline for live detections + low-latency UI updates." },
            { t: "Analytics core", d: "FastAPI + Postgres + object storage for evidence and metrics." },
          ].map((b) => (
            <Card key={b.t} className="border-border/60 bg-card/60 p-6">
              <p className="text-sm font-semibold">{b.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.d}</p>
            </Card>
          ))}
        </div>
        <pre className="mt-6 overflow-x-auto rounded-2xl border border-border/60 bg-card/60 p-6 text-xs leading-relaxed text-muted-foreground">
{`  Cameras ──▶ Edge GPU ──▶ Detection ──▶ ANPR/OCR ──▶ Evidence Pack
                  │             │             │             │
                  ▼             ▼             ▼             ▼
              WS Gateway   Postgres      Object Store   Notifications
                  └────────────────  Analytics Dashboard  ───────────┘`}
        </pre>
      </div>
    </section>
  );
}

function AnalyticsShowcase() {
  return (
    <section className="border-y border-border/60 bg-secondary/30">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center">
        <div>
          <SectionHeader eyebrow="Analytics" title="Operational insight, not just dashboards" align="left" />
          <p className="text-muted-foreground">Time-of-day trends, hotspot heatmaps, repeat-offender clustering and accuracy monitoring — all in one place.</p>
          <Button asChild className="mt-6"><Link to="/analytics">Explore analytics</Link></Button>
        </div>
        <Card className="border-border/60 bg-card/60 p-6">
          <div className="grid grid-cols-2 gap-3">
            {[{ k: "12,847", v: "Total violations" }, { k: "94.7%", v: "Accuracy" }, { k: "96.2%", v: "OCR success" }, { k: "+18%", v: "Week over week" }].map((s) => (
              <div key={s.v} className="rounded-lg border border-border/60 bg-background/40 p-4">
                <div className="text-2xl font-semibold">{s.k}</div>
                <div className="text-xs text-muted-foreground">{s.v}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}

function DemoWorkflow() {
  return (
    <section className="bg-grid">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <SectionHeader eyebrow="Demo" title="See it end-to-end" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { t: "1. Upload footage", d: "Drag a clip or connect a camera.", to: "/upload" },
            { t: "2. Watch live detection", d: "Bounding boxes and ANPR appear as we process.", to: "/upload" },
            { t: "3. Review & export", d: "Verify, file and export tamper-evident evidence.", to: "/violations" },
          ].map((s) => (
            <Card key={s.t} className="border-border/60 bg-card/60 p-6">
              <p className="text-lg font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
              <Button asChild variant="link" className="mt-3 px-0"><Link to={s.to}>Try it →</Link></Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const faqs = [
    { q: "Does it work with existing CCTV?", a: "Yes. Any RTSP or ONVIF stream works. We also support HLS and direct uploads." },
    { q: "Can it run on-premise?", a: "Edge nodes run on your hardware. Only metrics and aggregated stats sync to the cloud." },
    { q: "How accurate is the ANPR?", a: "Typically 95–97% on Indian plates with motion-blur tolerant decoding." },
    { q: "Is the data tamper-evident?", a: "Each evidence pack is hashed and signed with chain-of-custody metadata." },
  ];
  return (
    <section id="faq" className="border-t border-border/60 bg-secondary/30">
      <div className="mx-auto max-w-3xl px-6 py-20">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={f.q} value={`i${i}`} className="border-border/60">
              <AccordionTrigger className="text-left">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, subtitle, align = "center" }: { eyebrow: string; title: string; subtitle?: string; align?: "center" | "left" }) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center" : ""}`}>
      <p className="text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
