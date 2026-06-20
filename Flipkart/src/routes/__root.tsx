import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid bg-grid-fade ambient-glow px-4">
      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8 text-center shadow-[0_12px_48px_oklch(0_0_0/0.4),0_0_80px_-20px_var(--glow-primary)]">
          <h1 className="text-7xl font-bold text-foreground">404</h1>
          <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Go home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid bg-grid-fade ambient-glow px-4">
      <div className="relative z-10 w-full max-w-md">
        <Card className="p-8 text-center shadow-[0_12px_48px_oklch(0_0_0/0.4),0_0_80px_-20px_var(--glow-primary)]">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            This page didn't load
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Something went wrong on our end. You can try refreshing or head back home.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button
              onClick={() => {
                router.invalidate();
                reset();
              }}
              variant="default"
              className="w-full"
            >
              Try again
            </Button>
            <Link
              to="/"
              className={cn(buttonVariants({ variant: "outline" }), "w-full")}
            >
              Go home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "TrafficVision AI — Intelligent Traffic Violation Detection" },
      { name: "description", content: "Enterprise AI platform for real-time traffic violation detection: helmet, triple-riding, illegal parking, ANPR/OCR — all with live analytics." },
      { property: "og:title", content: "TrafficVision AI — Intelligent Traffic Violation Detection" },
      { property: "og:description", content: "Enterprise AI platform for real-time traffic violation detection: helmet, triple-riding, illegal parking, ANPR/OCR — all with live analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "TrafficVision AI — Intelligent Traffic Violation Detection" },
      { name: "twitter:description", content: "Enterprise AI platform for real-time traffic violation detection: helmet, triple-riding, illegal parking, ANPR/OCR — all with live analytics." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/676cddda-c775-4b9c-9667-245d7b36a63b/id-preview-f4d66376--37b740de-2b53-4275-92cf-64161b51485c.lovable.app-1781799676248.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/676cddda-c775-4b9c-9667-245d7b36a63b/id-preview-f4d66376--37b740de-2b53-4275-92cf-64161b51485c.lovable.app-1781799676248.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster theme="dark" position="top-right" />
    </QueryClientProvider>
  );
}
