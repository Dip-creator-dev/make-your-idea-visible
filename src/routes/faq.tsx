import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/faq")({
  head: () => ({ meta: [{ title: "FAQ — Aurelle" }, { name: "description", content: "Answers to common questions about Aurelle orders." }, { property: "og:title", content: "FAQ — Aurelle" }, { property: "og:description", content: "Answers to common questions about Aurelle orders." }] }),
  component: () => (
    <div className="container-store max-w-3xl py-12">
      <h1 className="text-4xl md:text-5xl">FAQ</h1>
      <div className="mt-6 space-y-4 text-muted-foreground"><p><strong>How do I pay?</strong> Cash on delivery is available at checkout.</p><p><strong>Can I use a coupon?</strong> Yes, try WELCOME10 for 10% off or FREESHIP.</p></div>
    </div>
  ),
});
