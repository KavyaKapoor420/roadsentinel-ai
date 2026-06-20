import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "./login";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot password — TrafficVision AI" }] }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthLayout title="Reset your password" subtitle="We'll send a reset link to your inbox.">
      {sent ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">If an account exists for <span className="text-foreground">{email}</span>, a reset link is on its way.</p>
          <Button asChild className="w-full"><Link to="/login">Back to login</Link></Button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            await api.forgotPassword(email);
            toast.success("Reset link sent");
            setSent(true);
          }}
        >
          <div className="space-y-1.5"><Label htmlFor="e">Work email</Label><Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <Button className="w-full" type="submit">Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
