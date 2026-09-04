"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePingu } from "@/lib/store";

const filtros = ["Minhas", "Todas"] as const;

export default function ComunidadesPage() {
  const { eu, comunidades, criarComunidade, toggleComunidade, ehDono, excluirComunidade } = usePingu();
  const [filtro, setFiltro] = useState<(typeof filtros)[number]>("Minhas");
  const [q, setQ] = useState("");
  const [nova, setNova] = useState("");
  const [legenda, setLegenda] = useState("");
  const [capa, setCapa] = useState("");
  const [tipo, setTipo] = useState<"aberta" | "fechada" | "moderada">("aberta");
  const [excluirSlug, setExcluirSlug] = useState("");
  const [frase, setFrase] = useState("");

  const lista = useMemo(() => {
    let base = comunidades;
    if (filtro === "Minhas") base = base.filter((c) => eu.comunidades.includes(c.slug) || ehDono(c.slug));
    if (q.trim()) base = base.filter((c) => c.nome.toLowerCase().includes(q.toLowerCase()));
    return base;
  }, [filtro, q, comunidades, eu.comunidades]);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-extrabold text-[var(--rosa-escuro)]">
        Comunidades
      </h1>
      <form
        id="criar"
        className="card mt-4 space-y-2 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!nova.trim()) return;
          criarComunidade(nova.trim(), legenda.trim(), capa || undefined, tipo);
          setNova("");
          setLegenda("");
          setCapa("");
          setTipo("aberta");
        }}
      >
        <p className="font-bold">Criar comunidade</p>
        <input value={nova} onChange={(e) => setNova(e.target.value)} placeholder="Nome" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
        <input value={legenda} onChange={(e) => setLegenda(e.target.value)} placeholder="Legenda / descrição" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
        <label className="btn-secundario inline-block cursor-pointer">
          Foto da comunidade
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = () => setCapa(String(r.result));
              r.readAsDataURL(f);
            }}
          />
        </label>
        {capa && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={capa} alt="" className="h-20 rounded-xl object-cover" />
        )}
        <p className="text-sm font-semibold">Tipo</p>
        <div className="flex flex-wrap gap-2">
          {(["aberta", "moderada"] as const).map((t) => (
            <button key={t} type="button" className={tipo === t ? "btn-primario" : "btn-secundario"} onClick={() => setTipo(t)}>
              {t === "aberta" ? "Aberta" : "Moderada"}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--texto-3)]">
          Aberta: entra e publica. Moderada: entra, mas o dono aprova o post.
        </p>
        <button className="btn-primario" type="submit">
          Criar
        </button>
      </form>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="buscar comunidade" className="mt-3 w-full rounded-full border border-[var(--borda)] bg-white px-4 py-2 text-sm" />
      <div className="mt-3 flex gap-2">
        {filtros.map((f) => (
          <button key={f} type="button" onClick={() => setFiltro(f)} className={filtro === f ? "btn-primario" : "btn-secundario"}>
            {f}
          </button>
        ))}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lista.map((c) => {
          const dentro = eu.comunidades.includes(c.slug);
          return (
            <article key={c.slug} className="card overflow-hidden">
              {c.capa ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.capa} alt="" className="h-28 w-full object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://picsum.photos/seed/${c.slug}/600/200`} alt="" className="h-28 w-full object-cover" />
              )}
              <div className="p-4">
                <Link href={`/comunidades/${c.slug}`} className="font-bold hover:underline">
                  {c.nome}
                </Link>
                <p className="mt-1 text-sm text-[var(--texto-3)]">{c.descricao}</p>
                <button type="button" className={dentro ? "btn-secundario mt-3" : "btn-primario mt-3"} onClick={() => toggleComunidade(c.slug)}>
                  {dentro ? "Sair" : "Entrar"}
                </button>
                {ehDono(c.slug) && (
                  <div className="mt-3">
                    {excluirSlug !== c.slug ? (
                      <button type="button" className="btn-secundario" onClick={() => setExcluirSlug(c.slug)}>
                        Excluir comunidade
                      </button>
                    ) : (
                      <div className="space-y-2 text-sm">
                        <p>Quer excluir a comunidade? Escreve: excluir comunidade</p>
                        <input value={frase} onChange={(e) => setFrase(e.target.value)} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2" />
                        <button
                          type="button"
                          className="btn-primario"
                          disabled={frase.trim().toLowerCase() !== "excluir comunidade"}
                          onClick={() => {
                            excluirComunidade(c.slug);
                            setExcluirSlug("");
                            setFrase("");
                          }}
                        >
                          Excluir
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
