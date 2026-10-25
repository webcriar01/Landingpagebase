import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Artes e Encantos" },
      { name: "description", content: "Acesso à área administrativa da Artes e Encantos." },
      { property: "og:title", content: "Entrar — Artes e Encantos" },
      { property: "og:description", content: "Acesso à área administrativa." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error("E-mail ou senha incorretos.");
      nav({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
      setMode("in");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-5">
        <Link to="/" className="eyebrow">← Voltar à loja</Link>
        <h1 className="text-4xl">{mode === "in" ? "Entrar" : "Criar conta"}</h1>
        <div className="space-y-2"><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-2"><Label>Senha</Label><Input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" className="w-full" disabled={busy}>{mode === "in" ? "Entrar" : "Criar conta"}</Button>
        <button type="button" className="w-full text-sm text-muted-foreground hover:text-foreground" onClick={() => setMode(mode === "in" ? "up" : "in")}>
          {mode === "in" ? "Não tem conta? Criar uma" : "Já tem conta? Entrar"}
        </button>
      </form>
    </div>
  );
}
