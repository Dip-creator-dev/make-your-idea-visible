import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

const NAV = [
  { label: "Men", category: "men" },
  { label: "Women", category: "women" },
  { label: "Kids", category: "kids" },
  { label: "Accessories", category: "accessories" },
] as const;

export function Header() {
  const count = useCart((s) => s.lines.reduce((n, l) => n + l.qty, 0));
  const wish = useCart((s) => s.wishlist.length);
  const setOpen = useCart((s) => s.setOpen);
  const mounted = useMounted();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [menu, setMenu] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/shop", search: q.trim() ? { q: q.trim() } : {} });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="bg-primary py-2 text-center text-[11px] tracking-[0.2em] text-primary-foreground uppercase">
        Free shipping over ₹999 · Use WELCOME10 for 10% off
      </div>
      <div className="container-store flex h-16 items-center gap-4">
        <Sheet open={menu} onOpenChange={setMenu}>
          <SheetTrigger className="grid size-10 place-items-center md:hidden" aria-label="Open menu"><Menu className="size-5" /></SheetTrigger>
          <SheetContent side="left" className="bg-background">
            <SheetTitle className="font-display text-2xl">Aurelle</SheetTitle>
            <nav className="mt-8 flex flex-col gap-1">
              <Link to="/shop" search={{}} onClick={() => setMenu(false)} className="py-3 text-lg">Shop all</Link>
              {NAV.map((n) => (
                <Link key={n.category} to="/shop" search={{ category: n.category }} onClick={() => setMenu(false)} className="py-3 text-lg">{n.label}</Link>
              ))}
              <Link to="/about" onClick={() => setMenu(false)} className="py-3 text-lg">About</Link>
              <Link to="/contact" onClick={() => setMenu(false)} className="py-3 text-lg">Contact</Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="font-display text-2xl tracking-tight">Aurelle</Link>
        <nav className="ml-6 hidden gap-6 text-sm md:flex">
          <Link to="/shop" search={{}} className="text-muted-foreground hover:text-foreground" activeOptions={{ includeSearch: true }} activeProps={{ className: "text-foreground" }}>Shop all</Link>
          {NAV.map((n) => (
            <Link key={n.category} to="/shop" search={{ category: n.category }} className="text-muted-foreground hover:text-foreground" activeOptions={{ includeSearch: true }} activeProps={{ className: "text-foreground" }}>{n.label}</Link>
          ))}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden items-center gap-2 rounded-full border bg-card px-3 lg:flex" role="search">
          <Search className="size-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search products" className="h-9 w-44 bg-transparent text-sm outline-none" />
        </form>
        <div className="ml-auto flex items-center lg:ml-0">
          <Link to="/shop" search={{}} className="grid size-10 place-items-center lg:hidden" aria-label="Search"><Search className="size-5" /></Link>
          <Link to="/wishlist" className="relative grid size-10 place-items-center" aria-label="Wishlist">
            <Heart className="size-5" />
            {mounted && wish > 0 && <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-olive text-[9px] text-olive-foreground">{wish}</span>}
          </Link>
          <button type="button" onClick={() => setOpen(true)} className="relative grid size-10 place-items-center" aria-label="Open bag">
            <ShoppingBag className="size-5" />
            {mounted && count > 0 && <span key={count} className="animate-pop absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-primary text-[9px] text-primary-foreground">{count}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
