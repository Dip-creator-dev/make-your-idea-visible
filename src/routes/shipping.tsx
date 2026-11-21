import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/shipping")({
  head: () => ({ meta: [{ title: "Shipping & returns — Aurelle" }, { name: "description", content: "Aurelle shipping and returns policy." }, { property: "og:title", content: "Shipping & returns — Aurelle" }, { property: "og:description", content: "Aurelle shipping and returns policy." }] }),
  component: () => (
    <div className="container-store max-w-3xl py-12">
      <h1 className="text-4xl md:text-5xl">Shipping & returns</h1>
      <div className="mt-6 space-y-4 text-muted-foreground"><p>Free shipping on orders over ₹999; ₹79 below that.</p><p>Returns are accepted within 15 days of delivery.</p></div>
    </div>
  ),
});
