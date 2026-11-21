import { Link } from "@tanstack/react-router";
import { Newsletter } from "./Newsletter";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary/50">
      <div className="container-store grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="font-display text-3xl">Aurelle</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">Considered everyday clothing, made from honest fabrics and cut to last.</p>
          <div className="mt-6"><Newsletter /></div>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm md:col-span-6 md:col-start-7 md:grid-cols-3">
          <div className="space-y-2.5">
            <p className="eyebrow mb-4">Shop</p>
            <Link to="/shop" search={{ category: "men" }} className="block hover:underline">Men</Link>
            <Link to="/shop" search={{ category: "women" }} className="block hover:underline">Women</Link>
            <Link to="/shop" search={{ category: "kids" }} className="block hover:underline">Kids</Link>
            <Link to="/shop" search={{ category: "accessories" }} className="block hover:underline">Accessories</Link>
          </div>
          <div className="space-y-2.5">
            <p className="eyebrow mb-4">Help</p>
            <Link to="/faq" className="block hover:underline">FAQ</Link>
            <Link to="/shipping" className="block hover:underline">Shipping & returns</Link>
            <Link to="/contact" className="block hover:underline">Contact</Link>
          </div>
          <div className="space-y-2.5">
            <p className="eyebrow mb-4">Aurelle</p>
            <Link to="/about" className="block hover:underline">About</Link>
            <Link to="/wishlist" className="block hover:underline">Wishlist</Link>
            <Link to="/cart" className="block hover:underline">Bag</Link>
          </div>
        </div>
      </div>
      <div className="container-store border-t py-6 text-xs text-muted-foreground">© {new Date().getFullYear()} Aurelle. Prices in INR, inclusive of taxes.</div>
    </footer>
  );
}
