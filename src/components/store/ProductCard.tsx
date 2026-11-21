import { Link } from "@tanstack/react-router";
import { Heart, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";
import { GarmentArt } from "./GarmentArt";

export function ProductCard({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]!);
  const add = useCart((s) => s.add);
  const toggleWish = useCart((s) => s.toggleWish);
  const wished = useCart((s) => s.wishlist.includes(product.id));
  const mounted = useMounted();
  const [pop, setPop] = useState(0);

  const quickAdd = () => {
    const size = product.sizes[Math.floor(product.sizes.length / 2)]!;
    add({ productId: product.id, size, color: color.name, qty: 1 });
    toast.success(`${product.name} added`, { description: `${color.name} · ${size}` });
  };

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
        <Link to="/product/$slug" params={{ slug: product.slug }} aria-label={product.name} className="absolute inset-0 grid place-items-center text-foreground">
          <GarmentArt kind={product.kind} color={color.hex} className="h-[78%] transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-0 motion-reduce:transition-none" />
          <GarmentArt kind={product.kind} color={color.hex} back className="absolute h-[78%] scale-[0.98] opacity-0 transition-all duration-500 group-hover:scale-[1.04] group-hover:opacity-100 motion-reduce:transition-none" />
        </Link>
        <div className="pointer-events-none absolute left-3 top-3 flex gap-1.5">
          {product.isNew && <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest">New</span>}
          {product.compareAt && <span className="rounded-full bg-olive px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-olive-foreground">Sale</span>}
          {product.stock === 0 && <span className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Sold out</span>}
        </div>
        <button
          type="button"
          onClick={() => { toggleWish(product.id); setPop((p) => p + 1); }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={mounted && wished}
          className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-background/80 backdrop-blur transition hover:bg-background"
        >
          <Heart key={pop} className={`size-4 ${pop ? "animate-pop" : ""} ${mounted && wished ? "fill-foreground" : ""}`} />
        </button>
        {product.stock > 0 && (
          <button
            type="button"
            onClick={quickAdd}
            className="absolute inset-x-3 bottom-3 flex h-11 translate-y-2 items-center justify-center gap-2 rounded-full bg-primary text-sm text-primary-foreground opacity-0 transition-all duration-300 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
          >
            <Plus className="size-4" /> Quick add
          </button>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <Link to="/product/$slug" params={{ slug: product.slug }} className="text-sm font-medium hover:underline">{product.name}</Link>
          <p className="text-xs text-muted-foreground">{product.fabric}</p>
        </div>
        <p className="text-right text-sm">
          {formatINR(product.price)}
          {product.compareAt && <span className="block text-xs text-muted-foreground line-through">{formatINR(product.compareAt)}</span>}
        </p>
      </div>
      <div className="mt-2 flex gap-1.5">
        {product.colors.map((c) => (
          <button key={c.name} type="button" onClick={() => setColor(c)} aria-label={c.name} title={c.name}
            className={`size-4 rounded-full border transition ${c.name === color.name ? "ring-1 ring-foreground ring-offset-2 ring-offset-background" : ""}`}
            style={{ backgroundColor: c.hex }} />
        ))}
      </div>
    </article>
  );
}
