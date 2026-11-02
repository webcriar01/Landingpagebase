import { describe, it, expect } from "vitest";
import { effectivePrice, whatsappLink } from "./store";

describe("store rules", () => {
  it("uses promotional price only when on sale", () => {
    expect(effectivePrice({ price: 100, is_on_sale: true, promotional_price: 80 })).toBe(80);
    expect(effectivePrice({ price: 100, is_on_sale: false, promotional_price: 80 })).toBe(100);
  });
  it("sends the order to the store WhatsApp number", () => {
    expect(whatsappLink([{ name: "Vaso", qty: 2, price: 10 }])).toContain("wa.me/5562984769062");
  });
});
