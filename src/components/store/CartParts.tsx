import { Link } from "@tanstack/react-router";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getProductById } from "@/lib/catalog";
import { computeTotals, formatINR, FREE_SHIPPING_THRESHOLD, normalizeCoupon } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import { Progress } from "@/components/ui/progress";
import { GarmentArt } from "./GarmentArt";

export function useCartTotals() {
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const subtotal = lines.reduce((n, l) => n + (getProductById(l.productId)?.price ?? 0) * l.qty, 0);
  return computeTotals(subtotal, coupon);
}

export function CartLines({ compact = false }: { compact?: boolean }) {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const setOpen = useCart((s) => s.setOpen);
  return (
    <ul className="divide-y">
      {lines.map((l) => {
        const p = getProductById(l.productId);
        if (!p) return null;
        const hex = p.colors.find((c) => c.name === l.color)?.hex ?? p.colors[0]!.hex;
        return (
          <li key={`${l.productId}${l.size}${l.color}`} className="flex gap-4 py-4 first:pt-0">
            <div className={`grid shrink-0 place-items-center rounded-lg bg-secondary ${compact ? "h-24 w-20" : "h-32 w-28"}`}>
              <GarmentArt kind={p.kind} color={hex} className="h-[80%]" />
            </div>
            <div className="flex flex-1 flex-col">
              <div className="flex justify-between gap-2">
                <Link to="/product/$slug" params={{ slug: p.slug }} onClick={() => setOpen(false)} className="text-sm font-medium hover:underline">{p.name}</Link>
                <button type="button" onClick={() => remove(l)} aria-label={`Remove ${p.name}`} className="text-muted-foreground hover:text-foreground"><X className="size-4" /></button>
              </div>
              <p className="text-xs text-muted-foreground">{l.color} · {l.size}</p>
              <div className="mt-auto flex items-center justify-between pt-2">
                <div className="flex items-center rounded-full border">
                  <button type="button" onClick={() => setQty(l, l.qty - 1)} aria-label="Decrease quantity" className="grid size-8 place-items-center"><Minus className="size-3" /></button>
                  <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                  <button type="button" onClick={() => setQty(l, l.qty + 1)} aria-label="Increase quantity" className="grid size-8 place-items-center"><Plus className="size-3" /></button>
                </div>
                <p className="text-sm tabular-nums">{formatINR(p.price * l.qty)}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export function CartSummary() {
  const t = useCartTotals();
  const coupon = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const [code, setCode] = useState(coupon);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (t.subtotal - t.discount));
  const apply = (e: React.FormEvent) => {
    e.preventDefault();
    const c = normalizeCoupon(code);
    if (!c) { toast.error("That code isn't valid"); return; }
    setCoupon(c);
    toast.success(`${c} applied`);
  };
  return (
    <div className="space-y-4 text-sm">
      <div>
        <p className="text-xs text-muted-foreground">{remaining > 0 ? `${formatINR(remaining)} away from free shipping` : "You've unlocked free shipping"}</p>
        <Progress value={Math.min(100, ((t.subtotal - t.discount) / FREE_SHIPPING_THRESHOLD) * 100)} className="mt-2 h-1" />
      </div>
      <form onSubmit={apply} className="flex gap-2">
        <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Coupon code" aria-label="Coupon code" className="h-10 flex-1 rounded-full border bg-card px-4 uppercase outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        <button type="submit" className="h-10 rounded-full border px-4 hover:bg-secondary">Apply</button>
      </form>
      {t.coupon && <button type="button" onClick={() => { setCoupon(""); setCode(""); }} className="text-xs text-muted-foreground underline">Remove {t.coupon}</button>}
      <dl className="space-y-1.5">
        <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd className="tabular-nums">{formatINR(t.subtotal)}</dd></div>
        {t.discount > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Discount</dt><dd className="tabular-nums">−{formatINR(t.discount)}</dd></div>}
        <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd className="tabular-nums">{t.shipping ? formatINR(t.shipping) : "Free"}</dd></div>
        <div className="flex justify-between border-t pt-2 text-base font-medium"><dt>Total</dt><dd className="tabular-nums">{formatINR(t.total)}</dd></div>
      </dl>
    </div>
  );
}
