import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { api } from "@/services/api";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Login — TrafficVision AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("officer@city.gov");
  const [password, setPassword] = useState("demo1234");
  const [loading, setLoading] = useState(false);
  return (
    <AuthLayout title="Sign in to your console" subtitle="Welcome back, officer.">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          try { await api.login(email, password); toast.success("Signed in"); nav({ to: "/dashboard" }); }
          finally { setLoading(false); }
        }}
        className="space-y-4"
      >
        <Field label="Work email" id="email"><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></Field>
        <Field label="Password" id="pwd"><Input id="pwd" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></Field>
        <div className="flex items-center justify-between text-sm">
          <Link to="/forgot-password" className="text-muted-foreground hover:text-foreground">Forgot password?</Link>
          <Link to="/register" className="text-primary hover:underline">Create account</Link>
        </div>
        <Button disabled={loading} type="submit" className="w-full">{loading ? "Signing in…" : "Sign in"}</Button>
      </form>
    </AuthLayout>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background bg-grid bg-grid-fade px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center"><Brand /></div>
        <Card className="border-border/60 bg-card/70 p-8 backdrop-blur">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </Card>
      </div>
    </div>
  );
}
