
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { brl, effectivePrice, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const price = effectivePrice(p);
  const onSale = p.is_on_sale && p.promotional_price != null;

  const images = [
    p.main_image_url,
    ...(p.additional_images ?? []),
  ].filter((image): image is string => Boolean(image));

  const [currentImage, setCurrentImage] = useState(0);

  const previousImage = () => {
    setCurrentImage((current) =>
      current === 0 ? images.length - 1 : current - 1
    );
  };

  const nextImage = () => {
    setCurrentImage((current) =>
      (current + 1) % images.length
    );
  };

  return (
    <div className="group">
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        {images.length > 0 ? (
          <>
            <img
              src={images[currentImage]}
              alt={`${p.name} - imagem ${currentImage + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Imagem anterior"
                  onClick={previousImage}
                  className="absolute left-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#704820] shadow transition hover:bg-white"
                >
                  ‹
                </button>

                <button
                  type="button"
                  aria-label="Próxima imagem"
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-xl text-[#704820] shadow transition hover:bg-white"
                >
                  ›
                </button>

                <span className="absolute bottom-2 right-2 rounded-full bg-black/55 px-2.5 py-1 text-xs text-white">
                  {currentImage + 1}/{images.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center font-display text-muted-foreground">
            Sem imagem
          </div>
        )}

        {onSale && (
          <span className="eyebrow absolute left-3 top-3 bg-sale px-2 py-1 !text-primary-foreground">
            Oferta
          </span>
        )}
      </div>

      <div className="mt-4 space-y-1">
        <h3 className="text-xl leading-tight">{p.name}</h3>

        {p.description && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {p.description}
          </p>
        )}

        <div className="flex items-baseline gap-2 pt-1">
          <span className={onSale ? "text-sale" : ""}>
            {brl(price)}
          </span>

          {onSale && (
            <span className="text-sm text-muted-foreground line-through">
              {brl(Number(p.original_price ?? p.price))}
            </span>
          )}
        </div>

        <Button
          variant="outline"
          className="mt-3 w-full"
          onClick={() =>
            add({
              id: p.id,
              name: p.name,
              price,
              image: p.main_image_url,
            })
          }
        >
          Adicionar à sacola
        </Button>
      </div>
    </div>
  );
}
