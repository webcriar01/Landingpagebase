import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Product = Tables<"products">;
export type Category = Tables<"categories">;

export const STORE_NAME = "Artes e Encantos";
export const WHATSAPP_NUMBER = "5562984769062";

export const brl = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function effectivePrice(p: Pick<Product, "price" | "is_on_sale" | "promotional_price">) {
  return p.is_on_sale && p.promotional_price != null ? Number(p.promotional_price) : Number(p.price);
}

export function whatsappLink(items: { name: string; qty: number; price: number }[]) {
  const lines = items.map((i) => `• ${i.qty}x ${i.name} — ${brl(i.price * i.qty)}`);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const msg = `Olá, ${STORE_NAME}! Gostaria de fazer este pedido:\n\n${lines.join("\n")}\n\nTotal: ${brl(total)}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export const productsQuery = {
  queryKey: ["products", "public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};

export const categoriesQuery = {
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase.from("categories").select("*").order("name");
    if (error) throw error;
    return data;
  },
};

export async function uploadImage(file: File) {
  const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) throw error;
  const { data, error: e2 } = await supabase.storage
    .from("product-images")
    .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (e2) throw e2;
  return data.signedUrl;
}
