import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Aurelle" }, { name: "description", content: "Aurelle makes calm, considered everyday clothing." }, { property: "og:title", content: "About — Aurelle" }, { property: "og:description", content: "Aurelle makes calm, considered everyday clothing." }] }),
  component: () => (
    <div className="container-store max-w-3xl py-12">
      <h1 className="text-4xl md:text-5xl">About</h1>
      <div className="mt-6 space-y-4 text-muted-foreground"><p>Aurelle makes calm, considered everyday clothing from natural fibres, cut to last for years.</p><p>This is a demo store; product details are sample content.</p></div>
    </div>
  ),
});
