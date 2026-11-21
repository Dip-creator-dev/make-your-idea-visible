import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Aurelle" }, { name: "description", content: "Get in touch with Aurelle." }, { property: "og:title", content: "Contact — Aurelle" }, { property: "og:description", content: "Get in touch with Aurelle." }] }),
  component: Contact,
});

const field = "h-11 w-full rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim() || !/^\S+@\S+\.\S+$/.test(f.email) || !f.message.trim()) { toast.error("Please fill in every field"); return; }
    setBusy(true);
    const { error } = await supabase.from("messages").insert({ name: f.name.trim(), email: f.email.trim(), message: f.message.trim() });
    setBusy(false);
    if (error) { toast.error("Could not send. Try again."); return; }
    toast.success("Thanks — we'll reply soon.");
    setF({ name: "", email: "", message: "" });
  };
  return (
    <div className="container-store max-w-xl py-12">
      <h1 className="text-4xl md:text-5xl">Contact</h1>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <input className={field} placeholder="Name" aria-label="Name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
        <input className={field} type="email" placeholder="Email" aria-label="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        <textarea className="min-h-32 w-full rounded-xl border bg-card p-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Message" aria-label="Message" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} />
        <Button type="submit" size="lg" disabled={busy}>Send message</Button>
      </form>
    </div>
  );
}
