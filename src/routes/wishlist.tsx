import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/catalog";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — Aurelle" }, { name: "description", content: "Pieces you've saved at Aurelle." }, { property: "og:title", content: "Wishlist — Aurelle" }, { property: "og:description", content: "Pieces you've saved at Aurelle." }] }),
  component: Wishlist,
});

function Wishlist() {
  const ids = useCart((s) => s.wishlist);
  const mounted = useMounted();
  const items = mounted ? PRODUCTS.filter((p) => ids.includes(p.id)) : [];
  return (
    <div className="container-store py-10">
      <h1 className="text-4xl md:text-5xl">Wishlist</h1>
      {items.length === 0 ? (
        <p className="mt-6 text-muted-foreground">Nothing saved yet. Tap the heart on any piece. <Link to="/shop" search={{}} className="underline">Browse the shop</Link></p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
