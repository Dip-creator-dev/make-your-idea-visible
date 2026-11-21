import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { CartLines, CartSummary } from "@/components/store/CartParts";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your bag — Aurelle" }, { name: "description", content: "Review the pieces in your Aurelle bag." }, { property: "og:title", content: "Your bag — Aurelle" }, { property: "og:description", content: "Review the pieces in your bag." }] }),
  component: Cart,
});

function Cart() {
  const count = useCart((s) => s.lines.length);
  const mounted = useMounted();
  return (
    <div className="container-store py-10">
      <h1 className="text-4xl md:text-5xl">Your bag</h1>
      {!mounted || count === 0 ? (
        <p className="mt-6 text-muted-foreground">Your bag is empty. <Link to="/shop" search={{}} className="underline">Start shopping</Link></p>
      ) : (
        <div className="mt-8 grid gap-10 md:grid-cols-[1fr_360px]">
          <CartLines />
          <aside className="h-fit rounded-xl border bg-card p-6"><CartSummary /><Button asChild size="lg" className="mt-4 w-full"><Link to="/checkout">Checkout</Link></Button></aside>
        </div>
      )}
    </div>
  );
}
