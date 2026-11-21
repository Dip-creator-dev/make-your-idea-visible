import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "@/components/store/ProductCard";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_COLORS, ALL_SIZES, CATEGORIES, MAX_PRICE, PRODUCTS, type CategorySlug } from "@/lib/catalog";
import { formatINR } from "@/lib/pricing";

type Sort = "newest" | "price-asc" | "price-desc" | "popular";
interface ShopSearch { category?: CategorySlug; size?: string; color?: string; max?: number; sort?: Sort; q?: string; sale?: boolean; instock?: boolean }

const SORTS: Sort[] = ["popular", "newest", "price-asc", "price-desc"];
const SORT_LABEL: Record<Sort, string> = { popular: "Most popular", newest: "Newest", "price-asc": "Price: low to high", "price-desc": "Price: high to low" };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => {
    const out: ShopSearch = {};
    if (CATEGORIES.some((c) => c.slug === s["category"])) out.category = s["category"] as CategorySlug;
    if (typeof s["size"] === "string") out.size = s["size"];
    if (typeof s["color"] === "string") out.color = s["color"];
    if (typeof s["max"] === "number") out.max = s["max"];
    if (SORTS.includes(s["sort"] as Sort)) out.sort = s["sort"] as Sort;
    if (typeof s["q"] === "string" && s["q"]) out.q = s["q"];
    if (s["sale"] === true) out.sale = true;
    if (s["instock"] === true) out.instock = true;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Shop all — Aurelle" },
      { name: "description", content: "Browse Aurelle knits, tees, shirts, hoodies, jackets and coats. Filter by size, colour and price." },
      { property: "og:title", content: "Shop all — Aurelle" },
      { property: "og:description", content: "Knits, tees, shirts and outerwear in honest fabrics." },
    ],
  }),
  component: Shop,
});

const PAGE = 12;

function Shop() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const [shown, setShown] = useState(PAGE);
  const set = (patch: Partial<Record<keyof ShopSearch, unknown>>) => {
    setShown(PAGE);
    navigate({ search: (prev) => { const next = { ...prev, ...patch } as Record<string, unknown>; for (const k of Object.keys(next)) if (next[k] === undefined || next[k] === false) delete next[k]; return next as ShopSearch; }, replace: true });
  };

  const q = s.q?.toLowerCase();
  let list = PRODUCTS.filter((p) =>
    (!s.category || p.category === s.category) &&
    (!s.size || p.sizes.includes(s.size)) &&
    (!s.color || p.colors.some((c) => c.name === s.color)) &&
    (!s.max || p.price <= s.max) &&
    (!s.sale || !!p.compareAt) &&
    (!s.instock || p.stock > 0) &&
    (!q || `${p.name} ${p.fabric} ${p.kind} ${p.description}`.toLowerCase().includes(q)),
  );
  const sort = s.sort ?? "popular";
  list = [...list].sort((a, b) => sort === "price-asc" ? a.price - b.price : sort === "price-desc" ? b.price - a.price : sort === "newest" ? Number(b.isNew) - Number(a.isNew) || b.id.localeCompare(a.id) : b.popularity - a.popularity);
  const title = s.category ? CATEGORIES.find((c) => c.slug === s.category)!.name : s.sale ? "Sale" : s.q ? `Results for “${s.q}”` : "Shop all";

  const filters = (
    <div className="space-y-8 text-sm">
      <div>
        <p className="eyebrow mb-3">Search</p>
        <input defaultValue={s.q ?? ""} key={s.q ?? ""} onKeyDown={(e) => { if (e.key === "Enter") set({ q: (e.target as HTMLInputElement).value.trim() || undefined }); }} placeholder="Linen, hoodie…" aria-label="Search products" className="h-10 w-full rounded-full border bg-card px-4 outline-none focus-visible:ring-2 focus-visible:ring-ring" />
      </div>
      <div>
        <p className="eyebrow mb-3">Category</p>
        <div className="flex flex-col gap-2">
          <button type="button" onClick={() => set({ category: undefined })} className={`text-left ${!s.category ? "font-medium" : "text-muted-foreground"}`}>All</button>
          {CATEGORIES.map((c) => <button key={c.slug} type="button" onClick={() => set({ category: c.slug })} className={`text-left ${s.category === c.slug ? "font-medium" : "text-muted-foreground hover:text-foreground"}`}>{c.name}</button>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Size</p>
        <div className="flex flex-wrap gap-2">
          {ALL_SIZES.map((z) => <button key={z} type="button" onClick={() => set({ size: s.size === z ? undefined : z })} aria-pressed={s.size === z} className={`h-9 min-w-11 rounded-full border px-3 ${s.size === z ? "border-foreground bg-foreground text-background" : "hover:border-foreground"}`}>{z}</button>)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Colour</p>
        <div className="flex flex-wrap gap-2">
          {ALL_COLORS.map((c) => <button key={c.name} type="button" onClick={() => set({ color: s.color === c.name ? undefined : c.name })} aria-label={c.name} title={c.name} aria-pressed={s.color === c.name} className={`size-7 rounded-full border ${s.color === c.name ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ backgroundColor: c.hex }} />)}
        </div>
      </div>
      <div>
        <p className="eyebrow mb-3">Max price · {formatINR(s.max ?? MAX_PRICE)}</p>
        <Slider min={50000} max={MAX_PRICE} step={10000} defaultValue={[s.max ?? MAX_PRICE]} onValueCommit={(v) => set({ max: v[0]! >= MAX_PRICE ? undefined : v[0] })} aria-label="Maximum price" />
      </div>
      <div className="space-y-3">
        <label className="flex items-center gap-2"><Checkbox checked={!!s.instock} onCheckedChange={(v) => set({ instock: v === true })} /> In stock only</label>
        <label className="flex items-center gap-2"><Checkbox checked={!!s.sale} onCheckedChange={(v) => set({ sale: v === true })} /> On sale</label>
      </div>
      <Link to="/shop" search={{}} className="inline-block text-muted-foreground underline">Clear all</Link>
    </div>
  );

  return (
    <div className="container-store py-10">
      <p className="eyebrow">{list.length} pieces</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <h1 className="text-4xl md:text-5xl">{title}</h1>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger className="flex h-10 items-center gap-2 rounded-full border px-4 text-sm md:hidden"><SlidersHorizontal className="size-4" /> Filters</SheetTrigger>
            <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto bg-background"><SheetTitle className="mb-6">Filters</SheetTitle>{filters}</SheetContent>
          </Sheet>
          <select value={sort} onChange={(e) => set({ sort: e.target.value })} aria-label="Sort products" className="h-10 rounded-full border bg-card px-4 text-sm">
            {SORTS.map((o) => <option key={o} value={o}>{SORT_LABEL[o]}</option>)}
          </select>
        </div>
      </div>
      {(s.size || s.color) && (
        <div className="mt-4 flex gap-2">
          {s.size && <button type="button" onClick={() => set({ size: undefined })} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">Size {s.size} <X className="size-3" /></button>}
          {s.color && <button type="button" onClick={() => set({ color: undefined })} className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs">{s.color} <X className="size-3" /></button>}
        </div>
      )}
      <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr]">
        <aside className="hidden md:block">{filters}</aside>
        <div>
          {list.length === 0 ? (
            <div className="rounded-xl border border-dashed p-16 text-center">
              <p className="font-display text-2xl">Nothing matches yet</p>
              <p className="mt-2 text-sm text-muted-foreground">Try removing a filter or searching for something else.</p>
              <Link to="/shop" search={{}} className="mt-6 inline-block text-sm underline">Clear filters</Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3">{list.slice(0, shown).map((p) => <ProductCard key={p.id} product={p} />)}</div>
              {shown < list.length && <div className="mt-12 text-center"><button type="button" onClick={() => setShown((n) => n + PAGE)} className="h-12 rounded-full border px-8 text-sm hover:bg-secondary">Load more</button></div>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
