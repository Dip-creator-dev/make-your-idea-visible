import { createFileRoute, Link } from "@tanstack/react-router";
import { getOrder } from "@/lib/orders.functions";
import { formatINR } from "@/lib/pricing";

export const Route = createFileRoute("/order/$id")({
  loader: ({ params }) => getOrder({ data: { id: params.id } }),
  head: () => ({ meta: [{ title: "Order confirmed — Aurelle" }, { name: "description", content: "Your Aurelle order confirmation." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Order confirmed — Aurelle" }, { property: "og:description", content: "Your Aurelle order confirmation." }] }),
  component: OrderPage,
});

function OrderPage() {
  const o = Route.useLoaderData();
  if (!o) return <div className="container-store py-12"><h1 className="text-4xl">Order not found</h1></div>;
  return (
    <div className="container-store max-w-2xl py-12">
      <p className="eyebrow">Order placed</p>
      <h1 className="mt-2 text-4xl md:text-5xl">Thank you, {o.full_name.split(" ")[0]}.</h1>
      <p className="mt-4 text-muted-foreground">We'll ship to {o.address.city}, {o.address.state} {o.address.pin}. Pay {formatINR(o.total)} on delivery.</p>
      <ul className="mt-8 divide-y rounded-xl border bg-card">
        {o.order_items.map((i, n) => <li key={n} className="flex justify-between p-4 text-sm"><span>{i.name_snapshot} · {i.color_name} · {i.size} ×{i.qty}</span><span>{formatINR(i.price_snapshot * i.qty)}</span></li>)}
        <li className="flex justify-between p-4 font-medium"><span>Total</span><span>{formatINR(o.total)}</span></li>
      </ul>
      <Link to="/shop" search={{}} className="mt-8 inline-block underline">Continue shopping</Link>
    </div>
  );
}
