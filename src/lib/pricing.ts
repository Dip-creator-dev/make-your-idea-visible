export const FREE_SHIPPING_THRESHOLD = 99900; // ₹999 in paise
export const FLAT_SHIPPING = 7900; // ₹79

export type CouponCode = "WELCOME10" | "FREESHIP";

export function formatINR(paise: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
}

export interface Totals { subtotal: number; discount: number; shipping: number; total: number; coupon: CouponCode | null }

export function normalizeCoupon(code: string | null | undefined): CouponCode | null {
  const c = (code ?? "").trim().toUpperCase();
  return c === "WELCOME10" || c === "FREESHIP" ? c : null;
}

export function computeTotals(subtotal: number, couponInput?: string | null): Totals {
  const coupon = normalizeCoupon(couponInput);
  const discount = coupon === "WELCOME10" ? Math.round(subtotal * 0.1) : 0;
  const afterDiscount = subtotal - discount;
  const freeShip = coupon === "FREESHIP" || afterDiscount >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shipping = freeShip ? 0 : FLAT_SHIPPING;
  return { subtotal, discount, shipping, total: afterDiscount + shipping, coupon };
}
