
import { useEffect, useState } from "react";
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
  const [isExpanded, setIsExpanded] = useState(false);

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

  useEffect(() => {
    if (!isExpanded) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }

      if (event.key === "ArrowLeft" && images.length > 1) {
        previousImage();
      }

      if (event.key === "ArrowRight" && images.length > 1) {
        nextImage();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isExpanded, images.length]);

  const addToCart = () => {
    add({
      id: p.id,
      name: p.name,
      price,
      image: p.main_image_url,
    });
  };
  const addToCartAndClose = () => {
    addToCart();
    setIsExpanded(false);
  };
  return (
    <>
      <div className="group">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
          {images.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                aria-label={`Ampliar imagem de ${p.name}`}
                className="h-full w-full cursor-zoom-in"
              >
                <img
                  src={images[currentImage]}
                  alt={`${p.name} - imagem ${currentImage + 1}`}
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </button>

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
            onClick={addToCart}
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>

      {isExpanded && images.length > 0 && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setIsExpanded(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalhes de ${p.name}`}
            className="relative my-auto w-full max-w-5xl overflow-hidden rounded-xl bg-background shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              aria-label="Voltar ao catálogo"
              className="absolute left-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl text-[#704820] shadow-lg transition hover:bg-muted"
            >
              ←
            </button>

            <div className="grid md:grid-cols-2">
              <div className="relative flex min-h-[300px] items-center justify-center bg-black">
                <img
                  src={images[currentImage]}
                  alt={`${p.name} - imagem ${currentImage + 1}`}
                  className="max-h-[75vh] w-full object-contain"
                />

                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      aria-label="Imagem anterior"
                      onClick={previousImage}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-[#704820] shadow hover:bg-white"
                    >
                      ‹
                    </button>

                    <button
                      type="button"
                      aria-label="Próxima imagem"
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-[#704820] shadow hover:bg-white"
                    >
                      ›
                    </button>

                    <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-sm text-white">
                      {currentImage + 1}/{images.length}
                    </span>
                  </>
                )}
              </div>

              <div className="flex flex-col justify-center p-6 md:p-8">
                {onSale && (
                  <span className="eyebrow mb-3 w-fit bg-sale px-3 py-1 !text-primary-foreground">
                    Oferta
                  </span>
                )}

                <h2 className="text-2xl font-semibold leading-tight md:text-3xl">
                  {p.name}
                </h2>

                {p.description && (
                  <p className="mt-4 whitespace-pre-line text-muted-foreground">
                    {p.description}
                  </p>
                )}

                <div className="mt-6 flex items-baseline gap-3">
                  <span className={`text-2xl font-semibold ${onSale ? "text-sale" : ""}`}>
                    {brl(price)}
                  </span>

                  {onSale && (
                    <span className="text-base text-muted-foreground line-through">
                      {brl(Number(p.original_price ?? p.price))}
                    </span>
                  )}
                </div>

                <Button
                  variant="outline"
                  className="mt-6 w-full"
                  onClick={addToCartAndClose}
                >
                  Adicionar à sacola
                </Button>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="mt-4 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
                >
                  Voltar ao catálogo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
