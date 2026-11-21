import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CartLines, CartSummary } from "@/components/store/CartParts";
import { placeOrder, checkoutSchema } from "@/lib/orders.functions";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Aurelle" }, { name: "description", content: "Complete your Aurelle order." }, { property: "og:title", content: "Checkout — Aurelle" }, { property: "og:description", content: "Complete your Aurelle order." }] }),
  component: Checkout,
});

const FIELDS = [["fullName", "Full name"], ["email", "Email"], ["phone", "Mobile number"], ["line1", "Address line 1"], ["line2", "Address line 2 (optional)"], ["city", "City"], ["state", "State"], ["pin", "PIN code"]] as const;
type Key = (typeof FIELDS)[number][0];

function Checkout() {
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const clear = useCart((s) => s.clear);
  const mounted = useMounted();
  const navigate = useNavigate();
  const [f, setF] = useState<Record<Key, string>>({ fullName: "", email: "", phone: "", line1: "", line2: "", city: "", state: "", pin: "" });
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [busy, setBusy] = useState(false);

  if (!mounted || lines.length === 0) return <div className="container-store py-12"><h1 className="text-4xl">Checkout</h1><p className="mt-6 text-muted-foreground">Your bag is empty. <Link to="/shop" search={{}} className="underline">Start shopping</Link></p></div>;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = { ...f, ...(f.line2 ? {} : { line2: undefined }), coupon: coupon || undefined, lines };
    const parsed = checkoutSchema.safeParse(input);
    if (!parsed.success) {
      const errs: Partial<Record<Key, string>> = {};
      for (const i of parsed.error.issues) errs[i.path[0] as Key] = i.message;
      setErrors(errs); return;
    }
    setErrors({}); setBusy(true);
    try {
      const { id } = await placeOrder({ data: parsed.data });
      clear();
      navigate({ to: "/order/$id", params: { id } });
    } catch (err) { toast.error(err instanceof Error ? err.message : "Could not place order"); }
    finally { setBusy(false); }
  };

  return (
    <div className="container-store py-10">
      <h1 className="text-4xl md:text-5xl">Checkout</h1>
      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_380px]">
        <form onSubmit={submit} className="space-y-4" noValidate>
          {FIELDS.map(([k, label]) => (
            <div key={k}>
              <input aria-label={label} placeholder={label} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="h-11 w-full rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              {errors[k] && <p className="mt-1 px-4 text-xs text-destructive">{errors[k]}</p>}
            </div>
          ))}
          <div className="rounded-xl border p-4 text-sm"><p className="font-medium">Payment: Cash on delivery</p><p className="text-muted-foreground">Pay when your order arrives.</p></div>
          <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy ? "Placing order…" : "Place order"}</Button>
        </form>
        <aside className="h-fit space-y-6 rounded-xl border bg-card p-6"><CartLines compact /><CartSummary /></aside>
      </div>
    </div>
  );
}
