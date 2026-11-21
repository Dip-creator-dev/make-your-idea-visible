import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { CartLines, CartSummary } from "./CartParts";

export function CartDrawer() {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const lines = useCart((s) => s.lines);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col gap-0 bg-background p-0 sm:max-w-md">
        <div className="border-b p-6"><SheetTitle className="font-display text-2xl font-normal">Your bag</SheetTitle></div>
        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
            <p className="text-muted-foreground">Your bag is empty.</p>
            <Button asChild variant="outline" className="rounded-full" onClick={() => setOpen(false)}><Link to="/shop" search={{}}>Start shopping</Link></Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6"><CartLines compact /></div>
            <div className="border-t p-6">
              <CartSummary />
              <Button asChild size="lg" className="mt-4 w-full" onClick={() => setOpen(false)}><Link to="/checkout">Checkout</Link></Button>
              <Link to="/cart" onClick={() => setOpen(false)} className="mt-3 block text-center text-sm text-muted-foreground hover:underline">View full bag</Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
