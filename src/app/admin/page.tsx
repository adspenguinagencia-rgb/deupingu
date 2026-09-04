"use client";

import { ADMIN_EMAIL, usePingu } from "@/lib/store";
import { comunidades } from "@/data/mock";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function textoDe(x: { legenda?: string; texto?: string; nome?: string }) {
  return String(x.legenda || x.texto || x.nome || "").toLowerCase();
}

export default function AdminPage() {
  const ctx = usePingu();
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const q = busca.trim().toLowerCase();

  const {
    ehAdmin,
    estado,
    getUsuario,
    banirUsuario,
    usuarios,
    excluirComunidade,
    apagarPost,
    apagarStory,
  } = ctx;
  const apagarComentario = ctx.apagarComentario || ((id: string) => ctx.apagarPost(id));

  const cadastrados = (estado.contas || []).length;

  const online = useMemo(() => {
    const seen = estado.lastSeen || {};
    const limite = Date.now() - 5 * 60 * 1000;
    const ids = new Set<string>();
    Object.entries(seen).forEach(([id, t]) => {
      if (typeof t === "number" && t >= limite) ids.add(id);
    });
    if (estado.euId) ids.add(estado.euId);
    return ids.size;
  }, [estado.lastSeen, estado.euId]);

  const comms = useMemo(() => {
    const removidas = estado.comunidadesRemovidas || [];
    const extra = estado.comunidadesExtra || [];
    const map = new Map((comunidades || []).map((c) => [c.slug, c]));
    extra.forEach((c) => map.set(c.slug, c));
    removidas.forEach((s) => map.delete(s));
    return [...map.values()].filter((c) => !q || textoDe(c).includes(q) || c.slug.toLowerCase().includes(q));
  }, [estado.comunidadesExtra, estado.comunidadesRemovidas, q]);

  const pessoas = useMemo(
    () =>
      (usuarios || []).filter((u) => {
        if (!u) return false;
        const blob = `${u.nome} ${u.cidade} ${u.uf || ""} ${u.id}`.toLowerCase();
        return !q || blob.includes(q);
      }),
    [usuarios, q]
  );

  const posts = useMemo(
    () =>
      (estado.posts || []).filter((p) => {
        const nome = getUsuario(p.autorId)?.nome || "";
        return !q || textoDe(p).includes(q) || nome.toLowerCase().includes(q);
      }),
    [estado.posts, q, getUsuario]
  );

  const videos = useMemo(
    () =>
      [...(estado.posts || []), ...(estado.postsComunidade || [])].filter((p) => {
        const midia = Boolean((p as { video?: boolean; midia?: string }).video && (p as { midia?: string }).midia);
        if (!midia) return false;
        const nome = getUsuario(p.autorId)?.nome || "";
        return !q || textoDe(p).includes(q) || nome.toLowerCase().includes(q);
      }),
    [estado.posts, estado.postsComunidade, q, getUsuario]
  );

  const comentarios = useMemo(
    () =>
      (estado.comentarios || []).filter((c) => {
        const nome = getUsuario(c.autorId)?.nome || "";
        return !q || String(c.texto || "").toLowerCase().includes(q) || nome.toLowerCase().includes(q);
      }),
    [estado.comentarios, q, getUsuario]
  );

  if (!ehAdmin) {
    return (
      <div className="card mx-auto max-w-md p-6">
        <p>Só o dono entra aqui.</p>
        <button type="button" className="btn-primario mt-3" onClick={() => router.push("/entrar")}>
          Ir para login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">Painel do dono</h1>
      <p className="text-sm text-[var(--texto-2)]">{ADMIN_EMAIL}</p>
      <input
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar pessoa, comunidade, post, vídeo ou comentário"
        className="w-full rounded-xl border border-[var(--borda)] px-3 py-3 text-sm"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-sm text-[var(--texto-3)]">Pessoas cadastradas</p>
          <p className="text-3xl font-extrabold">{cadastrados}</p>
          <p className="mt-1 text-xs text-[var(--texto-3)]">Contas com e-mail neste site (neste aparelho).</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--texto-3)]">Online agora</p>
          <p className="text-3xl font-extrabold">{online}</p>
          <p className="mt-1 text-xs text-[var(--texto-3)]">Quem usou o site nos últimos 5 minutos neste aparelho.</p>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Pessoas ({pessoas.length})</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {pessoas.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-2 text-sm">
              <span>
                {u.nome} · {u.cidade}
              </span>
              {u.id !== "dono-pinguork" && (
                <button type="button" className="btn-secundario" onClick={() => banirUsuario(u.id)}>
                  Excluir
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Comunidades ({comms.length})</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {comms.map((c) => (
            <li key={c.slug} className="flex items-center justify-between gap-2 text-sm">
              <span>{c.nome}</span>
              <button type="button" className="btn-secundario" onClick={() => excluirComunidade(c.slug)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Publicações ({posts.length})</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="line-clamp-2">
                {getUsuario(p.autorId)?.nome}: {p.legenda || "post"}
              </span>
              <button type="button" className="btn-secundario" onClick={() => apagarPost(p.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Vídeos ({videos.length})</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {videos.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="line-clamp-2">{textoDe(p) || "vídeo"}</span>
              <button type="button" className="btn-secundario" onClick={() => apagarPost(p.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Comentários ({comentarios.length})</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {comentarios.map((c) => (
            <li key={c.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="line-clamp-2">
                {getUsuario(c.autorId)?.nome}: {c.texto}
              </span>
              <button type="button" className="btn-secundario" onClick={() => apagarComentario(c.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Stories</h2>
        <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
          {(estado.stories || [])
            .filter((s) => !q || (getUsuario(s.autorId)?.nome || "").toLowerCase().includes(q))
            .map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{getUsuario(s.autorId)?.nome} · story</span>
                <button type="button" className="btn-secundario" onClick={() => apagarStory(s.id)}>
                  Excluir
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
