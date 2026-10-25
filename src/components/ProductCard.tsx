import { useCart } from "@/lib/cart";
import { brl, effectivePrice, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const price = effectivePrice(p);
  const onSale = p.is_on_sale && p.promotional_price != null;
  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {p.main_image_url ? (
          <img src={p.main_image_url} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full items-center justify-center font-display text-muted-foreground">Sem imagem</div>
        )}
        {onSale && <span className="eyebrow absolute left-3 top-3 bg-sale px-2 py-1 !text-primary-foreground">Oferta</span>}
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-xl leading-tight">{p.name}</h3>
        {p.description && <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>}
        <div className="flex items-baseline gap-2 pt-1">
          <span className={onSale ? "text-sale" : ""}>{brl(price)}</span>
          {onSale && <span className="text-sm text-muted-foreground line-through">{brl(Number(p.original_price ?? p.price))}</span>}
        </div>
        <Button variant="outline" className="mt-3 w-full" onClick={() => add({ id: p.id, name: p.name, price, image: p.main_image_url })}>
          Adicionar à sacola
        </Button>
      </div>
    </div>
  );
}
