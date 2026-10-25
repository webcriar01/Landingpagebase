import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { categoriesQuery, productsQuery } from "@/lib/store";

export const Route = createFileRoute("/catalogo")({
  head: () => ({
    meta: [
      { title: "Catálogo — Artes e Encantos" },
      { name: "description", content: "Veja todas as peças artesanais da Artes e Encantos e monte seu pedido pelo WhatsApp." },
      { property: "og:title", content: "Catálogo — Artes e Encantos" },
      { property: "og:description", content: "Todas as peças artesanais, com pedido pelo WhatsApp." },
    ],
  }),
  component: Catalogo,
});

function Catalogo() {
  const { data: products = [], isLoading } = useQuery(productsQuery);
  const { data: cats = [] } = useQuery(categoriesQuery);
  const [cat, setCat] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const list = products.filter(
    (p) => (!cat || p.category_id === cat) && p.name.toLowerCase().includes(q.toLowerCase()),
  );
  const chip = (active: boolean) =>
    `border px-4 py-1.5 text-sm transition ${active ? "border-primary bg-primary text-primary-foreground" : "hover:border-primary"}`;

  return (
    <div>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p className="eyebrow">Coleção</p>
        <h1 className="mt-2 text-5xl">Catálogo</h1>
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <button className={chip(!cat)} onClick={() => setCat(null)}>Todos</button>
          {cats.map((c) => <button key={c.id} className={chip(cat === c.id)} onClick={() => setCat(c.id)}>{c.name}</button>)}
          <Input placeholder="Buscar…" value={q} onChange={(e) => setQ(e.target.value)} className="ml-auto w-full sm:w-56" />
        </div>
        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} p={p} />)}
        </div>
        {!isLoading && list.length === 0 && <p className="mt-12 text-muted-foreground">Nenhuma peça encontrada.</p>}
      </main>
      <SiteFooter />
    </div>
  );
}
