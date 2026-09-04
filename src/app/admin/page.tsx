"use client";

import { ADMIN_EMAIL, usePingu } from "@/lib/store";
import { comunidades } from "@/data/mock";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function AdminPage() {
  const {
    ehAdmin,
    estado,
    getUsuario,
    banirUsuario,
    usuarios,
    excluirComunidade,
    apagarPost,
    apagarComentario,
    apagarStory,
  } = usePingu();
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const q = busca.trim().toLowerCase();

  const cadastrados = useMemo(() => {
    const ids = new Set(usuarios.map((u) => u.id));
    return ids.size;
  }, [usuarios]);

  const online = useMemo(() => {
    const agora = Date.now();
    const vivos = usuarios.filter((u, i) => {
      if (u.id === estado.euId) return true;
      return (agora / 60000 + i) % 4 !== 0;
    }).length;
    return Math.max(1, Math.min(cadastrados, vivos));
  }, [usuarios, estado.euId, cadastrados]);

  const comms = useMemo(() => {
    const extra = estado.comunidadesExtra || [];
    const base = comunidades.filter((c) => !estado.comunidadesRemovidas.includes(c.slug));
    const map = new Map(base.map((c) => [c.slug, c]));
    extra.forEach((c) => map.set(c.slug, c));
    estado.comunidadesRemovidas.forEach((s) => map.delete(s));
    return [...map.values()].filter((c) => !q || c.nome.toLowerCase().includes(q) || c.slug.includes(q));
  }, [estado.comunidadesExtra, estado.comunidadesRemovidas, q]);

  const pessoas = useMemo(
    () =>
      usuarios.filter(
        (u) =>
          u.id !== "dono-pinguork" &&
          (!q || u.nome.toLowerCase().includes(q) || u.cidade.toLowerCase().includes(q) || (u.uf || "").toLowerCase().includes(q))
      ),
    [usuarios, q]
  );

  const posts = useMemo(
    () =>
      estado.posts.filter(
        (p) => !q || p.legenda.toLowerCase().includes(q) || getUsuario(p.autorId)?.nome.toLowerCase().includes(q)
      ),
    [estado.posts, q, getUsuario]
  );

  const videos = useMemo(
    () =>
      [...estado.posts, ...estado.postsComunidade].filter(
        (p) => p.video && p.midia && (!q || (p.legenda || p.texto || "").toLowerCase().includes(q))
      ),
    [estado.posts, estado.postsComunidade, q]
  );

  const comentarios = useMemo(
    () =>
      estado.comentarios.filter(
        (c) => !q || c.texto.toLowerCase().includes(q) || getUsuario(c.autorId)?.nome.toLowerCase().includes(q)
      ),
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
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--texto-3)]">Online agora</p>
          <p className="text-3xl font-extrabold">{online}</p>
        </div>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Pessoas</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {pessoas.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-2 text-sm">
              <span>
                {u.nome} · {u.cidade}
              </span>
              <button type="button" className="btn-secundario" onClick={() => banirUsuario(u.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Comunidades</h2>
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
        <h2 className="font-bold">Publicações</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {posts.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="line-clamp-2">
                {getUsuario(p.autorId)?.nome}: {p.legenda || (p.video ? "vídeo" : "foto")}
              </span>
              <button type="button" className="btn-secundario" onClick={() => apagarPost(p.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Vídeos</h2>
        <ul className="mt-3 max-h-80 space-y-2 overflow-auto">
          {videos.map((p) => (
            <li key={p.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="line-clamp-2">{p.legenda || p.texto || "vídeo"}</span>
              <button type="button" className="btn-secundario" onClick={() => apagarPost(p.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="card p-4">
        <h2 className="font-bold">Comentários</h2>
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
          {estado.stories
            .filter((s) => !q || getUsuario(s.autorId)?.nome.toLowerCase().includes(q))
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
