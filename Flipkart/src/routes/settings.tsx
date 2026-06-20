import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/services/api";
import { WS_URL } from "@/services/websocket";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — TrafficVision AI" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const health = useQuery({ queryKey: ["health"], queryFn: api.health, retry: 1 });

  return (
    <AppShell title="Settings" subtitle="Profile, API and notifications">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold">Profile</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field label="Name" defaultValue="Officer Demo" />
              <Field label="Email" defaultValue="officer@city.gov" />
              <Field label="Department" defaultValue="Traffic Enforcement" />
              <Field label="Badge ID" defaultValue="TFC-4421" />
            </div>
            <Button className="mt-5" onClick={() => toast.success("Profile saved")}>Save changes</Button>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="mt-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold">Appearance</h3>
            <p className="text-xs text-muted-foreground">Dark theme is the default for TrafficVision AI.</p>
            <Row label="Compact density"><Switch /></Row>
            <Row label="Show grid background"><Switch defaultChecked /></Row>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="mt-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold">API configuration</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <Field
                label="API base URL"
                defaultValue={API_BASE_URL || `${typeof window !== "undefined" ? window.location.origin : ""} (proxied → backend)`}
                readOnly
              />
              <Field label="WebSocket URL" defaultValue={WS_URL} readOnly />
              <Field
                label="Backend status"
                defaultValue={
                  health.isLoading
                    ? "Checking…"
                    : health.data?.status === "ok"
                      ? "Connected · models loaded"
                      : health.error
                        ? "Unreachable"
                        : health.data?.status ?? "Unknown"
                }
                readOnly
              />
              <Field label="Region" defaultValue="ap-south-1" readOnly />
            </div>
            <Button className="mt-5" onClick={() => toast.success("API settings saved")}>Save settings</Button>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold">Notifications</h3>
            <Row label="Email on new violation"><Switch defaultChecked /></Row>
            <Row label="Daily summary digest"><Switch defaultChecked /></Row>
            <Row label="System health alerts"><Switch /></Row>
            <Row label="Push notifications"><Switch defaultChecked /></Row>
          </Card>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function Field({ label, defaultValue, readOnly }: { label: string; defaultValue: string; readOnly?: boolean }) {
  const [v, setV] = useState(defaultValue);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input value={v} readOnly={readOnly} onChange={(e) => setV(e.target.value)} />
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4 first:border-0 first:pt-0">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}
