import { Link } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl, whatsappLink, STORE_NAME } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const cart = useCart();
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl tracking-tight">{STORE_NAME}</Link>
        <nav className="flex items-center gap-8 text-sm">
          <Link to="/" className="hidden hover:text-accent sm:inline">Início</Link>
          <Link to="/catalogo" className="hover:text-accent">Catálogo</Link>
          <button onClick={() => cart.setOpen(true)} className="relative" aria-label="Abrir sacola">
            <ShoppingBag className="h-5 w-5" />
            {cart.count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] text-accent-foreground">
                {cart.count}
              </span>
            )}
          </button>
        </nav>
      </div>
      <Sheet open={cart.open} onOpenChange={cart.setOpen}>
        <SheetContent className="flex w-full flex-col sm:max-w-md">
          <SheetHeader><SheetTitle className="font-display text-2xl font-medium">Sua sacola</SheetTitle></SheetHeader>
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {cart.items.length === 0 && <p className="text-sm text-muted-foreground">Sua sacola está vazia.</p>}
            {cart.items.map((i) => (
              <div key={i.id} className="flex gap-3 border-b pb-4">
                <div className="h-20 w-16 shrink-0 bg-muted">
                  {i.image && <img src={i.image} alt={i.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1">
                  <p className="font-display text-lg leading-tight">{i.name}</p>
                  <p className="text-sm text-muted-foreground">{brl(i.price)}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => cart.setQty(i.id, i.qty - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-6 text-center text-sm">{i.qty}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => cart.setQty(i.id, i.qty + 1)}><Plus className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="ml-auto h-7 w-7" onClick={() => cart.setQty(i.id, 0)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {cart.items.length > 0 && (
            <div className="space-y-3 border-t p-4">
              <div className="flex justify-between font-display text-xl"><span>Total</span><span>{brl(cart.total)}</span></div>
              <Button asChild className="w-full" size="lg">
                <a href={whatsappLink(cart.items)} target="_blank" rel="noreferrer">Finalizar pelo WhatsApp</a>
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t py-10 text-center text-sm text-muted-foreground">
      <p className="font-display text-xl text-foreground">{STORE_NAME}</p>
      <p className="mt-2">Peças feitas à mão com carinho · © {new Date().getFullYear()}</p>
      <Link to="/admin" className="mt-4 inline-block text-xs hover:text-foreground">Área administrativa</Link>
    </footer>
  );
}
