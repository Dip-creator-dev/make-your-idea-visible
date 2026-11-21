import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getProductById } from "@/lib/catalog";
import { computeTotals } from "@/lib/pricing";

export const checkoutSchema = z.object({
  email: z.string().trim().email().max(255),
  fullName: z.string().trim().min(2).max(120),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  line1: z.string().trim().min(3).max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  pin: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
  coupon: z.string().max(30).optional(),
  lines: z.array(z.object({ productId: z.string().max(10), size: z.string().max(20), color: z.string().max(40), qty: z.number().int().min(1).max(10) })).min(1).max(50),
});

export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => checkoutSchema.parse(d))
  .handler(async ({ data }) => {
    // Prices are recomputed here from the catalogue; the browser only sends ids and quantities.
    const items = data.lines.map((l) => {
      const p = getProductById(l.productId);
      if (!p) throw new Error("A product in your bag is no longer available");
      if (p.stock < l.qty) throw new Error(`${p.name} doesn't have enough stock`);
      if (!p.sizes.includes(l.size) || !p.colors.some((c) => c.name === l.color)) throw new Error(`Pick a valid size and colour for ${p.name}`);
      return { product_id: p.id, name_snapshot: p.name, size: l.size, color_name: l.color, price_snapshot: p.price, qty: l.qty };
    });
    const subtotal = items.reduce((n, i) => n + i.price_snapshot * i.qty, 0);
    const t = computeTotals(subtotal, data.coupon);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        email: data.email, full_name: data.fullName, phone: data.phone,
        address: { line1: data.line1, line2: data.line2 ?? "", city: data.city, state: data.state, pin: data.pin },
        payment_method: "cod", subtotal: t.subtotal, discount: t.discount, shipping: t.shipping, total: t.total, coupon: t.coupon,
      })
      .select("id")
      .single();
    if (error || !order) { console.error(error); throw new Error("Could not place your order. Please try again."); }
    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(items.map((i) => ({ ...i, order_id: order.id })));
    if (itemsError) { console.error(itemsError); throw new Error("Could not save your order items."); }
    return { id: order.id };
  });

export const getOrder = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("id, full_name, status, payment_method, subtotal, discount, shipping, total, address, created_at, order_items(name_snapshot, size, color_name, price_snapshot, qty)")
      .eq("id", data.id)
      .maybeSingle();
    if (!order) return null;
    // Only return what the confirmation page shows; no email or phone.
    return { ...order, address: order.address as { city: string; state: string; pin: string } };
  });
