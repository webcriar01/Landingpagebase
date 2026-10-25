import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type CartItem = { id: string; name: string; price: number; image: string | null; qty: number };

type Ctx = {
  items: CartItem[];
  open: boolean;
  setOpen: (o: boolean) => void;
  add: (i: Omit<CartItem, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  total: number;
};

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem("ae-cart");
      if (s) setItems(JSON.parse(s));
    } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem("ae-cart", JSON.stringify(items));
  }, [items]);

  const add: Ctx["add"] = (i) => {
    setItems((prev) => {
      const ex = prev.find((p) => p.id === i.id);
      return ex ? prev.map((p) => (p.id === i.id ? { ...p, qty: p.qty + 1 } : p)) : [...prev, { ...i, qty: 1 }];
    });
    setOpen(true);
  };
  const setQty = (id: string, qty: number) =>
    setItems((prev) => (qty <= 0 ? prev.filter((p) => p.id !== id) : prev.map((p) => (p.id === id ? { ...p, qty } : p))));

  return (
    <CartContext.Provider
      value={{
        items, open, setOpen, add, setQty,
        clear: () => setItems([]),
        count: items.reduce((s, i) => s + i.qty, 0),
        total: items.reduce((s, i) => s + i.qty * i.price, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart outside provider");
  return c;
}
