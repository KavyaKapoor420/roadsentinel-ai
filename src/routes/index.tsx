import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, FileText, Zap, Code, Upload } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TrafficVision AI — Real-time traffic violation detection" },
      { name: "description", content: "Detect helmet, triple-riding, illegal parking and signal jumps with AI. ANPR, live analytics and enterprise reporting." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* grid background spans the whole page */}
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="relative">
        <SiteNavbar />
        <Hero />
        <FaqSection />
        <SiteFooter />
      </div>
    </div>
  );
}

function CurlyArrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 70" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M48 4 C 42 22, 30 30, 18 34 C 10 36, 6 40, 10 48 C 14 56, 24 58, 30 56"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M26 50 L30 56 L36 52" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="relative">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-36 text-center md:pt-44">
        {/* Pill badge */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-sm font-medium text-foreground/90 backdrop-blur transition-colors hover:border-primary/50"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Now live ANPR streaming is available
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>

        {/* Hand-drawn caption + curly arrow */}
        <div className="relative mt-14 md:mt-16">
          <div className="absolute -top-14 left-1/2 hidden -translate-x-[15%] items-center gap-2 md:flex">
            <span className="circle-annotate font-serif-italic text-2xl text-[oklch(0.82_0.16_55)]">
              Helmet, Parking or Signal Jump
            </span>
            <CurlyArrow className="h-14 w-12 -translate-x-2 translate-y-6 text-[oklch(0.82_0.16_55)]" />
          </div>

          {/* Main heading */}
          <h1 className="font-extrabold leading-[1.05] tracking-tight text-foreground">
            <span className="block text-5xl md:text-7xl">
              Detect every{" "}
              <span className="marker-highlight">Violation</span>{" "}
              in
            </span>
            <span className="mt-2 block bg-gradient-to-b from-foreground to-muted-foreground/70 bg-clip-text text-5xl text-transparent md:text-7xl">
              Real Time, City-Wide.
            </span>
          </h1>
        </div>

        {/* Subheading */}
        <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Connect your CCTV, body-cams or upload footage. TrafficVision AI instantly produces{" "}
          <span className="font-semibold text-foreground">detections</span>,{" "}
          <span className="font-semibold text-foreground">plate reads</span>,{" "}
          <span className="font-semibold text-foreground">evidence packs</span>, and lets you{" "}
          <span className="font-semibold text-foreground">review</span> every violation in seconds.
        </p>

        {/* Feature cards */}
        <div className="mt-14 grid w-full max-w-4xl gap-4 sm:grid-cols-2">
          <FeatureCard
            icon={<FileText className="h-5 w-5 text-[oklch(0.78_0.16_60)]" />}
            iconBg="bg-[oklch(0.78_0.16_60/0.15)]"
            title="Powered by Vision AI"
            desc="Flawlessly detects riders, helmets, plates and complex multi-lane scenes."
          />
          <FeatureCard
            icon={<Zap className="h-5 w-5 text-primary" />}
            iconBg="bg-primary/15"
            title="Instant Evidence Generation"
            desc="Annotated images, ANPR, metadata and chain-of-custody ready in seconds."
          />
        </div>

        {/* CTAs */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-full glow-primary px-6">
            <Link to="/upload">
              <Upload className="mr-2 h-4 w-4" /> Upload Footage
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full border-border/70 bg-transparent px-6">
            <Link to="/dashboard">
              <Code className="mr-2 h-4 w-4" /> View Example Output
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  iconBg,
  title,
  desc,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-card/40 p-5 text-left backdrop-blur-sm transition-colors hover:border-border">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${iconBg}`}>{icon}</span>
      <div>
        <h3 className="text-base font-bold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function FaqSection() {
  const faqs = [
    { q: "Does it work with existing CCTV?", a: "Yes. Any RTSP, ONVIF or HLS stream works, and direct file uploads are supported. Edge nodes can run on your existing on-prem GPU hardware." },
    { q: "What types of violations can it detect?", a: "Helmet absence, triple riding, illegal parking, signal jumps, wrong-lane driving and more. Vehicle classification (car, motorcycle, truck, bus, auto) is bundled with every detection." },
    { q: "How accurate is the ANPR / plate reading?", a: "Typically 95–97% on Indian plates with motion-blur tolerant decoding. Every plate carries a confidence score so your team can prioritise review." },
    { q: "Can I review a specific violation or camera?", a: "Yes — every detection links to an annotated evidence viewer with bounding boxes, OCR metadata, timestamp, camera ID and a tamper-evident hash for court submission." },
    { q: "Is the data secure and tamper-evident?", a: "Each evidence pack is hashed and signed with chain-of-custody metadata. Access is role-based with full audit logs and SOC2-aligned controls." },
    { q: "What happens after I upload footage?", a: "Frames are decoded, vision models run detection + classification, ANPR reads visible plates and a violation record is created with annotated evidence — all visible live as it processes." },
  ];

  return (
    <section className="relative border-t border-border/40">
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="text-center">
          <span className="inline-block rounded-full border border-border/60 bg-card/60 px-4 py-1.5 text-xs font-semibold text-foreground/90 backdrop-blur">
            FAQs
          </span>
          <h2 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground md:text-5xl">
            Frequently Asked{" "}
            <span className="font-serif-italic font-normal italic text-muted-foreground">Questions</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-12 w-full space-y-3">
          {faqs.map((f, i) => (
            <AccordionItem
              key={f.q}
              value={`i${i}`}
              className="overflow-hidden rounded-2xl border border-border/60 bg-card/40 px-5 backdrop-blur-sm data-[state=open]:border-border"
            >
              <AccordionTrigger className="py-5 text-left text-base font-semibold hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
