import { describe, expect, it } from "vitest";
import { computeTotals } from "./pricing";

describe("pricing rules", () => {
  it("charges ₹79 shipping below ₹999", () => {
    expect(computeTotals(50000).shipping).toBe(7900);
    expect(computeTotals(50000).total).toBe(57900);
  });
  it("ships free at ₹999 or more", () => {
    expect(computeTotals(99900).shipping).toBe(0);
  });
  it("WELCOME10 takes 10% off", () => {
    const t = computeTotals(200000, "welcome10");
    expect(t.discount).toBe(20000);
    expect(t.total).toBe(180000);
  });
  it("FREESHIP removes shipping on small orders", () => {
    expect(computeTotals(50000, "FREESHIP").total).toBe(50000);
  });
  it("ignores unknown coupons", () => {
    expect(computeTotals(50000, "BOGUS").discount).toBe(0);
  });
});
