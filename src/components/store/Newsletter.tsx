import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { toast.error("Enter a valid email"); return; }
    setBusy(true);
    const { error } = await supabase.from("newsletter").insert({ email: email.trim().toLowerCase() });
    setBusy(false);
    if (error && error.code !== "23505") { toast.error("Could not subscribe. Try again."); return; }
    toast.success("You're on the list.");
    setEmail("");
  };
  return (
    <form onSubmit={submit} className="flex max-w-sm gap-2">
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" aria-label="Email address"
        className="h-11 flex-1 rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      <Button type="submit" disabled={busy} className="h-11 rounded-full px-5">Subscribe</Button>
    </form>
  );
}
