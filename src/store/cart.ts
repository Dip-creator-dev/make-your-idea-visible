import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartLine { productId: string; size: string; color: string; qty: number }
const key = (l: Pick<CartLine, "productId" | "size" | "color">) => `${l.productId}|${l.size}|${l.color}`;

interface CartState {
  lines: CartLine[];
  coupon: string;
  open: boolean;
  wishlist: string[];
  add: (l: CartLine) => void;
  setQty: (l: CartLine, qty: number) => void;
  remove: (l: CartLine) => void;
  clear: () => void;
  setCoupon: (c: string) => void;
  setOpen: (o: boolean) => void;
  toggleWish: (id: string) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      coupon: "",
      open: false,
      wishlist: [],
      add: (l) =>
        set((s) => {
          const existing = s.lines.find((x) => key(x) === key(l));
          const lines = existing
            ? s.lines.map((x) => (key(x) === key(l) ? { ...x, qty: Math.min(10, x.qty + l.qty) } : x))
            : [...s.lines, l];
          return { lines, open: true };
        }),
      setQty: (l, qty) => set((s) => ({ lines: s.lines.map((x) => (key(x) === key(l) ? { ...x, qty: Math.max(1, Math.min(10, qty)) } : x)) })),
      remove: (l) => set((s) => ({ lines: s.lines.filter((x) => key(x) !== key(l)) })),
      clear: () => set({ lines: [], coupon: "" }),
      setCoupon: (coupon) => set({ coupon }),
      setOpen: (open) => set({ open }),
      toggleWish: (id) => set((s) => ({ wishlist: s.wishlist.includes(id) ? s.wishlist.filter((w) => w !== id) : [...s.wishlist, id] })),
    }),
    { name: "aurelle-cart", partialize: (s) => ({ lines: s.lines, coupon: s.coupon, wishlist: s.wishlist }) },
  ),
);
