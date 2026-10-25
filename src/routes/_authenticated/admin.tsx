import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brl, categoriesQuery, uploadImage, type Product } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Painel — Artes e Encantos" },
      { name: "description", content: "Gerencie produtos e categorias da loja." },
      { property: "og:title", content: "Painel — Artes e Encantos" },
      { property: "og:description", content: "Gerencie produtos e categorias." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const allProductsQuery = {
  queryKey: ["products", "admin"],
  queryFn: async () => {
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};

function Admin() {
  const qc = useQueryClient();
  const nav = useNavigate();
  const { data: products = [] } = useQuery(allProductsQuery);
  const { data: cats = [] } = useQuery(categoriesQuery);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const refresh = () => qc.invalidateQueries();

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  async function del(id: string) {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return void toast.error(error.message);
    toast.success("Produto excluído");
    refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div><p className="eyebrow">Artes e Encantos</p><h1 className="text-4xl">Painel</h1></div>
        <div className="flex gap-2">
          <Button asChild variant="ghost"><Link to="/">Ver loja</Link></Button>
          <Button variant="outline" onClick={logout}>Sair</Button>
        </div>
      </div>
      <Tabs defaultValue="produtos" className="mt-8">
        <TabsList><TabsTrigger value="produtos">Produtos</TabsTrigger><TabsTrigger value="categorias">Categorias</TabsTrigger></TabsList>
        <TabsContent value="produtos" className="mt-6">
          <Button onClick={() => setEditing({ is_published: true, is_featured: false, is_on_sale: false })}><Plus className="mr-1 h-4 w-4" />Novo produto</Button>
          <div className="mt-6 divide-y border bg-card">
            {products.length === 0 && <p className="p-6 text-sm text-muted-foreground">Nenhum produto ainda.</p>}
            {products.map((p) => (
              <div key={p.id} className="flex items-center gap-4 p-3">
                <div className="h-14 w-12 shrink-0 bg-muted">{p.main_image_url && <img src={p.main_image_url} alt="" className="h-full w-full object-cover" />}</div>
                <div className="flex-1">
                  <p className="flex items-center gap-2 font-medium">{p.name}{p.is_featured && <Star className="h-3 w-3 fill-accent text-accent" />}</p>
                  <p className="text-xs text-muted-foreground">
                    {brl(Number(p.price))}{p.is_on_sale && p.promotional_price != null && ` · oferta ${brl(Number(p.promotional_price))}`} · {p.is_published ? "Publicado" : "Oculto"}
                  </p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="categorias" className="mt-6"><Categories cats={cats} onChange={refresh} /></TabsContent>
      </Tabs>
      {editing && <ProductForm initial={editing} cats={cats} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
    </div>
  );
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function Categories({ cats, onChange }: { cats: { id: string; name: string }[]; onChange: () => void }) {
  const [name, setName] = useState("");
  async function add(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("categories").insert({ name, slug: slugify(name) });
    if (error) return void toast.error(error.message);
    setName(""); onChange();
  }
  async function del(id: string) {
    if (!confirm("Excluir categoria?")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return void toast.error(error.message);
    onChange();
  }
  return (
    <div className="max-w-md">
      <form onSubmit={add} className="flex gap-2"><Input placeholder="Nova categoria" required value={name} onChange={(e) => setName(e.target.value)} /><Button type="submit">Adicionar</Button></form>
      <div className="mt-4 divide-y border bg-card">
        {cats.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-3"><span>{c.name}</span><Button size="icon" variant="ghost" onClick={() => del(c.id)}><Trash2 className="h-4 w-4" /></Button></div>
        ))}
      </div>
    </div>
  );
}

function ProductForm({ initial, cats, onClose, onSaved }: { initial: Partial<Product>; cats: { id: string; name: string }[]; onClose: () => void; onSaved: () => void }) {
  const [f, setF] = useState<Partial<Product>>(initial);
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setF((p) => ({ ...p, [k]: v }));
  const num = (v: string) => (v === "" ? null : Number(v));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>, extra = false) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setBusy(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      if (extra) set("additional_images", [...(f.additional_images ?? []), ...urls]);
      else set("main_image_url", urls[0] ?? null);
    } catch (err) { toast.error((err as Error).message); }
    setBusy(false);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (f.is_on_sale && f.promotional_price == null) return void toast.error("Informe o preço promocional.");
    setBusy(true);
    const payload = {
      name: f.name!, description: f.description ?? null, price: Number(f.price),
      is_on_sale: !!f.is_on_sale, original_price: f.is_on_sale ? (f.original_price ?? Number(f.price)) : null,
      promotional_price: f.is_on_sale ? f.promotional_price ?? null : null,
      category_id: f.category_id ?? null, is_published: !!f.is_published, is_featured: !!f.is_featured,
      main_image_url: f.main_image_url ?? null, additional_images: f.additional_images ?? [],
    };
    const { error } = f.id
      ? await supabase.from("products").update(payload).eq("id", f.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);
    if (error) return void toast.error(error.message);
    toast.success("Produto salvo");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle className="font-display text-2xl font-medium">{f.id ? "Editar produto" : "Novo produto"}</DialogTitle></DialogHeader>
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-2"><Label>Nome</Label><Input required value={f.name ?? ""} onChange={(e) => set("name", e.target.value)} /></div>
          <div className="space-y-2"><Label>Descrição</Label><Textarea value={f.description ?? ""} onChange={(e) => set("description", e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2"><Label>Preço (R$)</Label><Input required type="number" step="0.01" min="0" value={f.price ?? ""} onChange={(e) => set("price", num(e.target.value) as number)} /></div>
            <div className="space-y-2"><Label>Categoria</Label>
              <Select value={f.category_id ?? "none"} onValueChange={(v) => set("category_id", v === "none" ? null : v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="none">Sem categoria</SelectItem>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between"><Label>Em oferta</Label><Switch checked={!!f.is_on_sale} onCheckedChange={(v) => set("is_on_sale", v)} /></div>
          {f.is_on_sale && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Preço original</Label><Input type="number" step="0.01" value={f.original_price ?? ""} onChange={(e) => set("original_price", num(e.target.value))} /></div>
              <div className="space-y-2"><Label>Preço promocional</Label><Input type="number" step="0.01" value={f.promotional_price ?? ""} onChange={(e) => set("promotional_price", num(e.target.value))} /></div>
            </div>
          )}
          <div className="flex items-center justify-between"><Label>Publicado</Label><Switch checked={!!f.is_published} onCheckedChange={(v) => set("is_published", v)} /></div>
          <div className="flex items-center justify-between"><Label>Destaque na página inicial</Label><Switch checked={!!f.is_featured} onCheckedChange={(v) => set("is_featured", v)} /></div>
          <div className="space-y-2">
            <Label>Imagem principal</Label>
            {f.main_image_url && <img src={f.main_image_url} alt="" className="h-32 w-24 object-cover" />}
            <Input type="file" accept="image/*" onChange={(e) => onFile(e)} />
          </div>
          <div className="space-y-2">
            <Label>Imagens adicionais</Label>
            <div className="flex flex-wrap gap-2">
              {(f.additional_images ?? []).map((u) => (
                <button type="button" key={u} title="Remover" onClick={() => set("additional_images", (f.additional_images ?? []).filter((x) => x !== u))}>
                  <img src={u} alt="" className="h-16 w-14 object-cover" />
                </button>
              ))}
            </div>
            <Input type="file" accept="image/*" multiple onChange={(e) => onFile(e, true)} />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>{busy ? "Aguarde…" : "Salvar"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
