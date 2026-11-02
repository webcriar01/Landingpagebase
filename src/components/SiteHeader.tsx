import { Link } from "@tanstack/react-router";
import { ShoppingBag, Minus, Plus, Trash2, Instagram } from "lucide-react";
import { useCart } from "@/lib/cart";
import { brl, whatsappLink, STORE_NAME } from "@/lib/store";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const cart = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-[#E8D7DD] bg-[#F9F1F4]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-6">
        <Link
          to="/"
          className="flex min-h-10 items-center"
          aria-label="Artes e Encantos - Página inicial"
        >
          {/* ESPAÇO RESERVADO PARA A FUTURA IMAGEM DA LOGO */}
          <span className="font-display text-2xl tracking-wide text-[#704820] md:text-3xl">
            {STORE_NAME}
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm text-[#704820] md:gap-8">
          <Link to="/" className="hidden transition-colors hover:text-[#D88FA8] sm:inline">
            Início
          </Link>

          <Link to="/catalogo" className="transition-colors hover:text-[#D88FA8]">
            Catálogo
          </Link>

          <a
            href="https://www.instagram.com/arte.encantos0/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visite nosso Instagram"
            className="flex items-center transition-colors hover:text-[#D88FA8]"
          >
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </a>

          <button
            onClick={() => cart.setOpen(true)}
            className="relative rounded-full p-2 transition-colors hover:bg-[#EFD4DD]"
            aria-label={`Abrir sacola. ${cart.count} itens`}
          >
            <ShoppingBag className="h-5 w-5" />

            {cart.count > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#D88FA8] px-1 text-[10px] font-semibold text-white">
                {cart.count}
              </span>
            )}
          </button>
        </nav>
      </div>

      <Sheet open={cart.open} onOpenChange={cart.setOpen}>
        <SheetContent className="flex w-full flex-col border-[#E8D7DD] bg-[#F9F1F4] sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-display text-3xl font-medium text-[#704820]">
              Sua sacola
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {cart.items.length === 0 && (
              <p className="py-8 text-sm text-[#806D72]">Sua sacola está vazia.</p>
            )}

            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-3 border-b border-[#E8D7DD] pb-4">
                <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm bg-[#EFD4DD]">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-display text-lg leading-tight text-[#704820]">{item.name}</p>

                  <p className="text-sm text-[#806D72]">{brl(item.price)}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 border-[#E8D7DD] text-[#704820]"
                      onClick={() => cart.setQty(item.id, item.qty - 1)}
                      aria-label={`Diminuir quantidade de ${item.name}`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>

                    <span className="w-6 text-center text-sm text-[#704820]">{item.qty}</span>

                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 border-[#E8D7DD] text-[#704820]"
                      onClick={() => cart.setQty(item.id, item.qty + 1)}
                      aria-label={`Aumentar quantidade de ${item.name}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-auto h-7 w-7 text-[#D88FA8] hover:bg-[#EFD4DD]"
                      onClick={() => cart.setQty(item.id, 0)}
                      aria-label={`Remover ${item.name} da sacola`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cart.items.length > 0 && (
            <div className="space-y-3 border-t border-[#E8D7DD] p-4">
              <div className="flex justify-between font-display text-xl text-[#704820]">
                <span>Total</span>
                <span>{brl(cart.total)}</span>
              </div>

              <Button
                asChild
                className="w-full bg-[#704820] text-white hover:bg-[#573719]"
                size="lg"
              >
                <a href={whatsappLink(cart.items)} target="_blank" rel="noreferrer">
                  Finalizar pelo WhatsApp
                </a>
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
    <footer className="border-t border-[#E8D7DD] bg-white py-12 text-center">
      <p className="font-display text-2xl text-[#704820]">{STORE_NAME}</p>

      <p className="mt-3 text-sm text-[#806D72]">Peças feitas à mão com carinho</p>
      <a
        href="https://www.instagram.com/arte.encantos0/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Visite nosso Instagram"
        className="mt-5 inline-flex items-center gap-2 text-sm text-[#704820] transition-colors hover:text-[#D88FA8]"
      >
        <Instagram className="h-5 w-5" />
        <span>@arte.encantos0</span>
      </a>
      <p className="mt-2 text-xs text-[#806D72]">
        © {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados.
      </p>
    </footer>
  );
}
