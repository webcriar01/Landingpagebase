import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { productsQuery, WHATSAPP_NUMBER } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artes e Encantos — Peças artesanais feitas à mão" },
      { name: "description", content: "Decoração, presentes e artesanato feitos à mão. Escolha no catálogo e peça pelo WhatsApp." },
      { property: "og:title", content: "Artes e Encantos — Peças artesanais" },
      { property: "og:description", content: "Decoração, presentes e artesanato feitos à mão." },
    ],
  }),
  component: Index,
});

function Index() {
  const { data = [] } = useQuery(productsQuery);
  const featured = (data.filter((p) => p.is_featured).length ? data.filter((p) => p.is_featured) : data).slice(0, 4);
  return (
    <div>
      <SiteHeader />
      <section className="relative">
        <img src={hero} alt="Peças artesanais" width={1600} height={1008} className="h-[78vh] w-full object-cover" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="ml-auto max-w-md md:mr-8">
              <p className="eyebrow">Feito à mão</p>
              <h1 className="mt-4 text-5xl leading-[1.05] md:text-7xl">Encanto em cada detalhe</h1>
              <p className="mt-6 text-muted-foreground">Peças artesanais pensadas para deixar sua casa — e seus presentes — mais especiais.</p>
              <Button asChild size="lg" className="mt-8"><Link to="/catalogo">Ver catálogo</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between">
          <div><p className="eyebrow">Seleção</p><h2 className="mt-2 text-4xl">Destaques</h2></div>
          <Link to="/catalogo" className="text-sm underline-offset-4 hover:underline">Ver tudo</Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-muted-foreground">Novas peças chegando em breve.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {featured.map((p) => <ProductCard key={p.id} p={p} />)}
          </div>
        )}
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-3">
          {[
            ["Artesanal", "Cada peça é feita à mão, única como quem a recebe."],
            ["Sob medida", "Personalizamos cores e detalhes para a sua ocasião."],
            ["Pedido fácil", "Monte sua sacola e finalize direto pelo WhatsApp."],
          ].map(([t, d]) => (
            <div key={t}><h3 className="text-2xl">{t}</h3><p className="mt-3 text-sm text-muted-foreground">{d}</p></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="text-4xl">Quer algo especial?</h2>
        <p className="mt-4 text-muted-foreground">Fale com a gente e criamos uma peça só sua.</p>
        <Button asChild variant="outline" size="lg" className="mt-8">
          <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">Conversar no WhatsApp</a>
        </Button>
      </section>
      <SiteFooter />
    </div>
  );
}
