import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GarmentArt } from "@/components/store/GarmentArt";
import { ProductCard } from "@/components/store/ProductCard";
import { CATEGORIES, getProduct, PRODUCTS } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.product;
    const title = p ? `${p.name} — Aurelle` : "Product unavailable — Aurelle";
    const desc = p ? `${p.description} ${formatINR(p.price)}.` : "This product is unavailable.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "product" }] };
  },
  notFoundComponent: () => (
    <div className="container-store py-24 text-center"><h1 className="text-4xl">Product not found</h1><Link to="/shop" search={{}} className="mt-6 inline-block underline">Back to shop</Link></div>
  ),
  component: ProductPage,
});

function pinMessage(pin: string) {
  if (!/^[1-9]\d{5}$/.test(pin)) return "Enter a valid 6-digit PIN code.";
  const first = Number(pin[0]);
  if (first <= 4) return "Delivers in 2–4 days. Cash on delivery available.";
  if (first <= 7) return "Delivers in 4–6 days. Cash on delivery available.";
  return "Delivers in 6–8 days. Prepaid only for this area.";
}

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const [color, setColor] = useState(p.colors[0]!);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0]! : null);
  const [qty, setQty] = useState(1);
  const [view, setView] = useState<"front" | "back">("front");
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(p.id));
  const mounted = useMounted();
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);
  const cat = CATEGORIES.find((c) => c.slug === p.category)!;

  const addToBag = () => {
    if (!size) { toast.error("Choose a size first"); return; }
    add({ productId: p.id, size, color: color.name, qty });
    toast.success(`${p.name} added`, { description: `${color.name} · ${size} · ×${qty}` });
  };

  return (
    <div className="container-store py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <Link to="/" className="hover:underline">Home</Link> / <Link to="/shop" search={{ category: p.category }} className="hover:underline">{cat.name}</Link> / <span className="text-foreground">{p.name}</span>
      </nav>
      <div className="mt-6 grid gap-10 md:grid-cols-2 lg:gap-16">
        <div>
          <div className="group relative grid aspect-[4/5] place-items-center overflow-hidden rounded-xl bg-secondary text-foreground">
            <GarmentArt kind={p.kind} color={color.hex} back={view === "back"} className="h-[80%] transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none" />
          </div>
          <div className="mt-3 flex gap-3">
            {(["front", "back"] as const).map((v) => (
              <button key={v} type="button" onClick={() => setView(v)} aria-label={`Show ${v}`} aria-pressed={view === v} className={`grid h-24 w-20 place-items-center rounded-lg bg-secondary text-foreground ${view === v ? "ring-2 ring-foreground" : ""}`}>
                <GarmentArt kind={p.kind} color={color.hex} back={v === "back"} className="h-[80%]" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">{cat.name} · {p.fit}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{p.name}</h1>
          <p className="mt-4 text-xl">{formatINR(p.price)} {p.compareAt && <span className="ml-2 text-base text-muted-foreground line-through">{formatINR(p.compareAt)}</span>}</p>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of all taxes</p>
          <p className="mt-6 max-w-prose text-muted-foreground">{p.description}</p>

          <div className="mt-8">
            <p className="text-sm">Colour: <span className="text-muted-foreground">{color.name}</span></p>
            <div className="mt-3 flex gap-2">
              {p.colors.map((c) => <button key={c.name} type="button" onClick={() => setColor(c)} aria-label={c.name} aria-pressed={c.name === color.name} className={`size-9 rounded-full border ${c.name === color.name ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ backgroundColor: c.hex }} />)}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between text-sm">
              <p>Size</p>
              <Dialog>
                <DialogTrigger className="text-muted-foreground underline">Size guide</DialogTrigger>
                <DialogContent className="bg-background">
                  <DialogTitle className="font-display text-2xl font-normal">Size guide</DialogTitle>
                  <table className="w-full text-sm">
                    <thead><tr className="border-b text-left text-muted-foreground"><th className="py-2">Size</th><th>Chest (in)</th><th>Length (in)</th></tr></thead>
                    <tbody>{[["XS", "34–36", "26"], ["S", "36–38", "27"], ["M", "38–40", "28"], ["L", "40–42", "29"], ["XL", "42–44", "30"]].map((r) => <tr key={r[0]} className="border-b"><td className="py-2">{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td></tr>)}</tbody>
                  </table>
                  <p className="text-xs text-muted-foreground">Between sizes? Take the larger one for a relaxed fit.</p>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.sizes.map((z) => <button key={z} type="button" onClick={() => setSize(z)} aria-pressed={size === z} className={`h-11 min-w-14 rounded-full border px-4 text-sm ${size === z ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{z}</button>)}
            </div>
          </div>

          <p className={`mt-6 text-sm ${p.stock === 0 ? "text-destructive" : p.stock < 8 ? "text-olive" : "text-muted-foreground"}`}>
            {p.stock === 0 ? "Sold out" : p.stock < 8 ? `Only ${p.stock} left` : "In stock"}
          </p>

          <div className="mt-4 flex gap-3">
            <div className="flex items-center rounded-full border">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="grid size-12 place-items-center"><Minus className="size-4" /></button>
              <span className="w-6 text-center tabular-nums">{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity" className="grid size-12 place-items-center"><Plus className="size-4" /></button>
            </div>
            <Button size="lg" className="flex-1" disabled={p.stock === 0} onClick={addToBag}>{p.stock === 0 ? "Sold out" : "Add to bag"}</Button>
            <button type="button" onClick={() => toggleWish(p.id)} aria-label={mounted && wished ? "Remove from wishlist" : "Add to wishlist"} className="grid size-12 place-items-center rounded-full border">
              <Heart className={`size-5 ${mounted && wished ? "animate-pop fill-foreground" : ""}`} />
            </button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setPinMsg(pinMessage(pin)); }} className="mt-8 rounded-xl border p-4">
            <p className="flex items-center gap-2 text-sm"><Truck className="size-4" /> Check delivery</p>
            <div className="mt-3 flex gap-2">
              <input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="PIN code" aria-label="PIN code" className="h-10 flex-1 rounded-full border bg-card px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
              <button type="submit" className="h-10 rounded-full border px-4 text-sm hover:bg-secondary">Check</button>
            </div>
            {pinMsg && <p className="mt-2 text-xs text-muted-foreground" role="status">{pinMsg}</p>}
          </form>

          <Accordion type="single" collapsible className="mt-6">
            <AccordionItem value="d"><AccordionTrigger>Details</AccordionTrigger><AccordionContent>{p.fit} fit. {p.description}</AccordionContent></AccordionItem>
            <AccordionItem value="f"><AccordionTrigger>Fabric & care</AccordionTrigger><AccordionContent>{p.fabric}. Machine wash cold, dry flat in shade, warm iron.</AccordionContent></AccordionItem>
            <AccordionItem value="s"><AccordionTrigger>Shipping & returns</AccordionTrigger><AccordionContent>Free shipping over ₹999, ₹79 below. Returns within 15 days of delivery.</AccordionContent></AccordionItem>
          </Accordion>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="mb-8 text-3xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
        </section>
      )}

      {p.stock > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t bg-background/95 p-3 backdrop-blur md:hidden">
          <div className="flex-1 text-sm"><p className="font-medium">{p.name}</p><p className="text-muted-foreground">{formatINR(p.price)}{size ? ` · ${size}` : ""}</p></div>
          <Button onClick={addToBag} className="h-11 rounded-full px-6">Add to bag</Button>
        </div>
      )}
    </div>
  );
}
