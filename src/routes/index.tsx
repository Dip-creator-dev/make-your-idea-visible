import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { HeroRail } from "@/components/home/HeroRail";
import { ProductCard } from "@/components/store/ProductCard";
import { Newsletter } from "@/components/store/Newsletter";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/lib/catalog";
import men from "@/assets/cat-men.jpg";
import women from "@/assets/cat-women.jpg";
import kids from "@/assets/cat-kids.jpg";
import acc from "@/assets/cat-accessories.jpg";
import linen from "@/assets/editorial-linen.jpg";
import folded from "@/assets/editorial-folded.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aurelle — Considered everyday clothing" },
      { name: "description", content: "Shop knits, tees, shirts and outerwear in honest fabrics. Free shipping across India over ₹999." },
      { property: "og:title", content: "Aurelle — Considered everyday clothing" },
      { property: "og:description", content: "Knits, tees, shirts and outerwear in honest fabrics." },
    ],
  }),
  component: Home,
});

const TILES = [
  { label: "Men", img: men, search: { category: "men" as const } },
  { label: "Women", img: women, search: { category: "women" as const } },
  { label: "Kids", img: kids, search: { category: "kids" as const } },
  { label: "Accessories", img: acc, search: { category: "accessories" as const } },
];

function Home() {
  const newIn = PRODUCTS.filter((p) => p.isNew).slice(0, 8);
  const best = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 4);
  return (
    <>
      <HeroRail />

      <section className="container-store">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="eyebrow">Shop by</p><h2 className="mt-2 text-3xl md:text-4xl">Category</h2></div>
          <div className="hidden gap-4 text-sm md:flex">
            <Link to="/shop" search={{ sort: "newest" }} className="underline-offset-4 hover:underline">New in</Link>
            <Link to="/shop" search={{ sale: true }} className="underline-offset-4 hover:underline">Sale</Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {TILES.map((t) => (
            <Link key={t.label} to="/shop" search={t.search} className="group relative block aspect-[4/5] overflow-hidden rounded-xl bg-secondary">
              <img src={t.img} alt={`${t.label} collection`} loading="lazy" width={800} height={1008} className="size-full object-cover transition duration-700 group-hover:scale-105 motion-reduce:transition-none" />
              <span className="absolute bottom-4 left-4 rounded-full bg-background px-4 py-2 text-sm">{t.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-store mt-24">
        <div className="mb-8 flex items-end justify-between">
          <div><p className="eyebrow">Just landed</p><h2 className="mt-2 text-3xl md:text-4xl">New arrivals</h2></div>
          <Link to="/shop" search={{ sort: "newest" }} className="text-sm underline-offset-4 hover:underline">View all</Link>
        </div>
        <div className="-mx-5 flex snap-x gap-4 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8">
          {newIn.map((p) => <div key={p.id} className="w-64 shrink-0 snap-start md:w-72"><ProductCard product={p} /></div>)}
        </div>
      </section>

      <section className="container-store mt-24 grid items-center gap-10 md:grid-cols-2">
        <img src={linen} alt="Model in a linen shirt and olive trousers" loading="lazy" width={1280} height={1600} className="aspect-[4/5] w-full rounded-xl object-cover" />
        <div className="md:pl-10">
          <p className="eyebrow">The linen edit</p>
          <h2 className="mt-3 text-4xl leading-tight md:text-5xl">Slow fabrics for warm afternoons.</h2>
          <p className="mt-5 max-w-md text-muted-foreground">Washed European linen and handspun khadi, cut loose so air can move. Softer with every wash.</p>
          <Button asChild size="lg" className="mt-8"><Link to="/shop" search={{ q: "linen" }}>Shop linen</Link></Button>
        </div>
      </section>

      <section className="container-store mt-24">
        <div className="mb-8"><p className="eyebrow">Most loved</p><h2 className="mt-2 text-3xl md:text-4xl">Bestsellers</h2></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">{best.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>

      <section className="container-store mt-24">
        <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Truck, t: "Free shipping", d: "On orders over ₹999" },
            { icon: RotateCcw, t: "Easy returns", d: "15 days, no fuss" },
            { icon: ShieldCheck, t: "Secure checkout", d: "Cash on delivery available" },
            { icon: Sparkles, t: "Honest fabric", d: "Natural fibres, clearly labelled" },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="flex items-center gap-4 bg-card p-6"><I className="size-5 text-olive" /><div><p className="text-sm font-medium">{t}</p><p className="text-xs text-muted-foreground">{d}</p></div></div>
          ))}
        </div>
      </section>

      <section className="container-store mt-24 grid items-center gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Join us</p>
          <h2 className="mt-3 text-4xl">Letters from the studio</h2>
          <p className="mt-4 text-muted-foreground">New pieces, care notes and the occasional early sale. No more than twice a month.</p>
          <div className="mt-6"><Newsletter /></div>
        </div>
        <img src={folded} alt="Folded knitwear in cream, olive, charcoal and rust" loading="lazy" width={1600} height={1104} className="w-full rounded-xl object-cover md:col-span-7" />
      </section>
    </>
  );
}
