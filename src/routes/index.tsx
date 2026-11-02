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
      {
        title: "Loja de Presentes em Caldas Novas | Artes e Encantos",
      },
      {
        name: "description",
        content:
          "Encontre presentes, buquês e artesanato em Caldas Novas na Artes e Encantos. Opções personalizadas e peças especiais para presentear.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:title",
        content: "Artes e Encantos | Presentes em Caldas Novas",
      },
      {
        property: "og:description",
        content:
          "Presentes especiais, buquês e artesanato em Caldas Novas. Conheça a variedade de criações da Artes e Encantos.",
      },
      {
        property: "og:url",
        content: "https://arteseencantos.com.br/",
      },
      {
        property: "og:image",
        content: "https://arteseencantos.com.br/images/compartilhamento.png",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:title",
        content: "Artes e Encantos | Presentes em Caldas Novas",
      },
      {
        name: "twitter:description",
        content: "Presentes especiais, buquês e artesanato em Caldas Novas.",
      },
      {
        name: "twitter:image",
        content: "https://arteseencantos.com.br/images/compartilhamento.png",
      },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "Store",
          name: "Artes e Encantos",
          url: "https://arteseencantos.com.br/",
          telephone: "+5562984769062",
          address: {
            "@type": "PostalAddress",
            streetAddress:
              "Rua Professor Josino Bretas, Qd 28 - Lt 04 - Centro",
            addressLocality: "Caldas Novas",
            addressRegion: "GO",
            postalCode: "75680-059",
            addressCountry: "BR",
          },
          openingHours: [
            "Mo-Fr 08:00-18:00",
            "Sa 08:00-17:00",
          ],
          areaServed: {
            "@type": "City",
            name: "Caldas Novas",
          },
        },
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://arteseencantos.com.br/",
      },
    ],
  }),

  component: Index,
});

function Index() {
  const { data = [] } = useQuery(productsQuery);

  const featured = (
    data.filter((product) => product.is_featured).length
      ? data.filter((product) => product.is_featured)
      : data
  ).slice(0, 4);

  return (
    <div className="overflow-hidden">
      <SiteHeader />

      <main>
        {/* HERO PRINCIPAL */}
        <section className="relative flex min-h-[620px] items-center bg-[#EFD4DD] md:min-h-[700px]">
          <img
            src={hero}
            alt="Ambiente delicado da Artes e Encantos"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-[#F9F1F4]/95 via-[#F9F1F4]/75 to-[#F9F1F4]/20" />

          <div className="relative mx-auto w-full max-w-6xl px-6 py-24">
            <div className="max-w-xl">
              <div className="mb-8">
                <img
                  src="/images/logo-artes-e-encantos.png"
                  alt="Artes e Encantos"
                  className="h-auto w-32 object-contain md:w-40"
                />
              </div>

              <p className="eyebrow">Delicadeza em cada criação</p>

              <h1 className="mt-5 text-5xl leading-[1.05] text-[#704820] sm:text-6xl md:text-7xl">
              Presentes em Caldas Novas para momentos especiais.
              </h1>

              <p className="mt-6 max-w-md text-base leading-7 text-[#704820]/85 md:text-lg">
              Encontre presentes especiais, buquês e artesanato em Caldas Novas. Criações feitas com carinho para surpreender pessoas especiais e tornar cada ocasião inesquecível.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#704820] text-white hover:bg-[#573719]">
                  <Link to="/catalogo">Conheça nossas criações</Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-[#704820] bg-white/60 text-[#704820] hover:bg-[#704820] hover:text-white transition-colors"
                >
                  <a href="#sobre">Conheça nossa história</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* APRESENTAÇÃO DA PROPRIETÁRIA */}
        <section id="sobre" className="bg-[#F9F1F4] scroll-mt-24">
          <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:gap-20 md:py-28">
            {/* FOTO DA PROPRIETÁRIA */}
            <div className="mx-auto w-full max-w-md">
              <div className="overflow-hidden rounded-sm">
                <img
                  src="/images/proprietaria-artes-e-encantos.jpeg"
                  alt="Proprietária da Artes e Encantos"
                  className="block h-auto w-full object-contain"
                />
              </div>
            </div>

            {/* TEXTO SOBRE A MARCA */}
            <div className="py-4">
              <p className="eyebrow">Por trás da marca</p>

              <h2 className="mt-5 text-4xl leading-tight text-[#704820] md:text-5xl">
                Muito mais que peças artesanais.
                <span className="block italic text-[#D88FA8]">Uma história de dedicação.</span>
              </h2>

              <p className="mt-6 text-base leading-8 text-[#806D72]">
              A Artes e Encantos é uma loja de presentes em Caldas Novas, onde você encontra buquês, artesanato e opções especiais para surpreender em diferentes ocasiões.
              </p>

              <p className="mt-4 text-base leading-8 text-[#806D72]">
              Valorizamos o trabalho artesanal, os detalhes feitos à mão e a variedade de produtos que tornam cada presente único e cheio de significado.
              </p>

              <p className="mt-4 text-base leading-8 text-[#806D72]">
                Queremos que cada pessoa encontre aqui algo que represente carinho, beleza e
                significado.
              </p>
            </div>
          </div>
        </section>

        {/* ESSÊNCIA DA MARCA */}
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <p className="eyebrow">Nossa essência</p>

              <h2 className="mt-4 text-4xl text-[#704820] md:text-5xl">
                O cuidado está em cada detalhe
              </h2>

              <p className="mt-5 leading-7 text-[#806D72]">
                Acreditamos que o trabalho artesanal tem um valor especial: cada criação recebe
                atenção, carinho e dedicação.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  number: "01",
                  title: "Feito à mão",
                  description:
                    "O cuidado artesanal está presente em cada etapa de nossas criações.",
                },
                {
                  number: "02",
                  title: "Atenção aos detalhes",
                  description:
                    "Valorizamos acabamentos, combinações e pequenos detalhes que fazem a diferença.",
                },
                {
                  number: "03",
                  title: "Feito para encantar",
                  description:
                    "Criamos peças pensadas para presentear, decorar e tornar momentos especiais.",
                },
              ].map((item) => (
                <div key={item.number} className="border-t border-[#EFD4DD] px-4 py-7">
                  <span className="font-display text-3xl text-[#D88FA8]">{item.number}</span>

                  <h3 className="mt-5 text-2xl text-[#704820]">{item.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-[#806D72]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUTOS EM DESTAQUE */}
        <section className="bg-[#EFD4DD]/45">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <div className="mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow">Escolhas especiais</p>

                <h2 className="mt-3 text-4xl text-[#704820] md:text-5xl">Nossas criações</h2>

                <p className="mt-3 text-sm text-[#806D72]">
                  Conheça algumas peças selecionadas especialmente para você.
                </p>
              </div>

              <Link
                to="/catalogo"
                className="text-sm font-semibold text-[#704820] underline underline-offset-4 hover:text-[#D88FA8]"
              >
                Ver catálogo completo
              </Link>
            </div>

            {featured.length === 0 ? (
              <div className="rounded-sm bg-white p-10 text-center">
                <p className="text-[#806D72]">Novas peças chegando em breve.</p>

                <Button asChild className="mt-5">
                  <Link to="/catalogo">Conhecer catálogo</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
                {featured.map((product) => (
                  <ProductCard key={product.id} p={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* PRESENTES */}
        <section className="bg-[#F9F1F4]">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-24">
            <div>
              <p className="eyebrow">Momentos especiais</p>

              <h2 className="mt-4 text-4xl leading-tight text-[#704820] md:text-5xl">
                Pequenos detalhes podem transformar grandes momentos.
              </h2>

              <p className="mt-5 leading-8 text-[#806D72]">
              Na Artes e Encantos, você encontra presentes em Caldas Novas, buquês e peças de artesanato para aniversários, datas comemorativas e outros momentos especiais. São opções para demonstrar carinho e tornar cada ocasião ainda mais significativa.
              </p>

              <Button asChild size="lg" className="mt-8 bg-[#D88FA8] text-white hover:bg-[#C77994]">
                <Link to="/catalogo">Encontrar algo especial</Link>
              </Button>
            </div>

            {/* ESPAÇO PARA FUTURA FOTO DE PRODUTOS OU EMBALAGENS */}
            <div className="flex aspect-[5/4] items-center justify-center overflow-hidden">
              <img
                src="/images/foto-produtos.png"
                alt="Presentes e criações da Artes e Encantos"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        </section>

        {/* CHAMADA PARA WHATSAPP */}
        <section className="bg-[#704820]">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-24">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#EFD4DD]">
              Artes e Encantos
            </p>

            <h2 className="mt-5 text-4xl leading-tight text-white md:text-5xl">
              Vamos encontrar algo especial para você?
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-7 text-white/80">
              Conheça nossas criações ou entre em contato para conversar sobre seu pedido.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-[#EFD4DD] text-[#704820] hover:bg-white">
                <Link to="/catalogo">Explorar catálogo</Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white bg-transparent text-white transition-colors hover:bg-[#EFD4DD] hover:text-[#704820] hover:border-[#EFD4DD]"
              >
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">
                  Conversar pelo WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
