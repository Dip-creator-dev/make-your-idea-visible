import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ClothingRailHero, type RailGarment } from "@/components/ui/product-rail-gallery";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";
import { useCart } from "@/store/cart";

const FEATURED = PRODUCTS.filter((p) => p.featured).slice(0, 10);

export function HeroRail() {
  const [open, setOpen] = useState<number | null>(null);
  const add = useCart((s) => s.add);
  const items = useMemo<RailGarment[]>(
    () => FEATURED.map((p) => ({ id: p.id, name: p.name, description: p.description, kind: p.kind, color: p.colors[0]!.hex, tag: formatINR(p.price), details: [p.fabric, `${p.fit} fit`, `${p.colors.length} colours`] })),
    [],
  );
  const current = open !== null ? FEATURED[open] : undefined;

  const action = current ? (
    <div className="flex flex-wrap justify-center gap-3">
      <Button asChild variant="outline" size="lg"><Link to="/product/$slug" params={{ slug: current.slug }}>View product</Link></Button>
      <Button size="lg" disabled={current.stock === 0} onClick={() => {
        const size = current.sizes[Math.floor(current.sizes.length / 2)]!;
        add({ productId: current.id, size, color: current.colors[0]!.name, qty: 1 });
        toast.success(`${current.name} added`, { description: `${current.colors[0]!.name} · ${size}` });
      }}>{current.stock === 0 ? "Sold out" : "Add to bag"}</Button>
    </div>
  ) : (
    <Button asChild size="lg"><Link to="/shop" search={{}}>Shop the collection</Link></Button>
  );

  return (
    <ClothingRailHero
      items={items}
      eyebrow="Autumn / Winter 2026"
      heading="Pieces worth keeping"
      caption="Hover, drag or tap a piece to turn it around"
      action={action}
      autoplay
      hanger="wood"
      onOpenChange={setOpen}
      className="py-12 md:py-20"
    />
  );
}
