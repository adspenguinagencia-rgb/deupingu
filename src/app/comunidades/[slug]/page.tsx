"use client";

import Link from "next/link";
import { use, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { Comentarios } from "@/components/Comentarios";
import { Reacoes } from "@/components/Reacoes";
import { getComunidade, topicos } from "@/data/mock";
import { usePingu } from "@/lib/store";

export default function ComunidadePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const {
    eu,
    comunidades,
    estado,
    toggleComunidade,
    membrosDa,
    getUsuario,
    publicarComunidade,
    ehDono,
    moderarPost,
    pedidoPendente,
    aprovarEntrada,
    removerMembro,
    excluirComunidade,
    editarComunidade,
  } = usePingu();
  const comunidade = comunidades.find((c) => c.slug === slug) || getComunidade(slug);
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [frase, setFrase] = useState("");
  const [confirmar, setConfirmar] = useState(false);
  const [buscaMembro, setBuscaMembro] = useState("");

  if (!comunidade) return <p>Comunidade não encontrada.</p>;

  const lista = topicos.filter((t) => t.comunidadeSlug === slug);
  const dentro = eu.comunidades.includes(slug);
  const membros = membrosDa(slug);
  const dono = ehDono(slug);
  const posts = estado.postsComunidade.filter((p) => p.comunidadeSlug === slug);

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={comunidade.capa || `https://picsum.photos/seed/${comunidade.slug}/900/280`}
          alt=""
          className="h-44 w-full object-cover"
        />
        <div className="p-5">
          <h1 className="text-2xl font-extrabold">{comunidade.nome}</h1>
          <p className="mt-1 text-sm text-[var(--texto-2)]">{comunidade.descricao}</p>
          {(comunidade.restrita || comunidade.tipo) && (
            <span className="chip mt-2 inline-block">{comunidade.tipo === "fechada" || comunidade.restrita ? "Fechada" : comunidade.tipo === "moderada" ? "Moderada" : "Aberta"}</span>
          )}
          {comunidade.donoId && <p className="text-xs text-[var(--texto-3)]">Dono: {getUsuario(comunidade.donoId)?.nome}</p>}
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className={dentro ? "btn-secundario" : "btn-primario"}
              onClick={() => toggleComunidade(slug)}
            >
              {dentro ? "Sair da comunidade" : pedidoPendente(slug) ? "Pedido enviado" : comunidade.tipo === "fechada" || comunidade.restrita ? "Pedir para entrar" : "Entrar na comunidade"}
            </button>
            {dono && (
              <button type="button" className="btn-secundario" onClick={() => setConfirmar(true)}>
                Excluir comunidade
              </button>
            )}
          </div>
          {dono && (
            <div className="mt-4 space-y-3 rounded-xl bg-[#fff0f5] p-3 text-sm">
              <p className="font-bold">Editar comunidade</p>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  editarComunidade(slug, {
                    nome: String(fd.get("nome") || comunidade.nome),
                    descricao: String(fd.get("desc") || comunidade.descricao),
                  });
                }}
              >
                <input name="nome" defaultValue={comunidade.nome} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2" />
                <input name="desc" defaultValue={comunidade.descricao} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2" />
                <label className="btn-secundario inline-block cursor-pointer">
                  Trocar foto
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (!f) return;
                      const r = new FileReader();
                      r.onload = () => editarComunidade(slug, { capa: String(r.result) });
                      r.readAsDataURL(f);
                    }}
                  />
                </label>
                <button className="btn-primario" type="submit">
                  Salvar
                </button>
              </form>
              {!confirmar ? (
                <button type="button" className="btn-secundario" onClick={() => setConfirmar(true)}>
                  Excluir comunidade
                </button>
              ) : (
                <div className="space-y-2">
                  <p>Quer excluir a comunidade? Escreve: excluir comunidade</p>
                  <input value={frase} onChange={(e) => setFrase(e.target.value)} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2" />
                  <button
                    type="button"
                    className="btn-primario"
                    disabled={frase.trim().toLowerCase() !== "excluir comunidade"}
                    onClick={() => {
                      if (frase.trim().toLowerCase() !== "excluir comunidade") return;
                      excluirComunidade(slug);
                      window.location.href = "/comunidades";
                    }}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {dentro && (
        <form
          className="card space-y-2 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!texto.trim() && !arquivo) return;
            if (arquivo) {
              const r = new FileReader();
              const video = arquivo.type.startsWith("video");
              r.onload = () => {
                publicarComunidade(slug, texto.trim() || (video ? "Vídeo" : "Foto"), String(r.result), video);
                setTexto("");
                setArquivo(null);
              };
              r.readAsDataURL(arquivo);
            } else {
              publicarComunidade(slug, texto.trim());
              setTexto("");
            }
          }}
        >
          <p className="font-bold">Publicar na comunidade</p>
          <p className="text-xs text-[var(--texto-3)]">Se você não é o dono, o post espera aprovação.</p>
          <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={2} className="w-full rounded-xl border border-[var(--borda)] p-2 text-sm" placeholder="Texto, foto ou vídeo…" />
          <input type="file" accept="image/*,video/*" onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
          <button className="btn-primario" type="submit">
            Enviar
          </button>
        </form>
      )}

      {posts.map((p) => {
        if (p.status !== "publicado" && !dono && p.autorId !== eu.id) return null;
        return (
          <article key={p.id} className="card p-4">
            <p className="text-sm font-bold">{getUsuario(p.autorId)?.nome}</p>
            {p.status === "pendente" && <p className="text-xs text-[var(--rosa-escuro)]">Aguardando o dono</p>}
            <p className="mt-1 text-sm">{p.texto}</p>
            {p.video && p.midia && <video src={p.midia} controls className="mt-2 max-h-64 w-full rounded-xl" />}
            {!p.video && p.midia && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.midia} alt="" className="mt-2 max-h-64 rounded-xl object-cover" />
            )}
            {p.status === "publicado" && (
              <>
                <div className="mt-2">
                  <Reacoes alvo={p.id} />
                </div>
                <Comentarios postId={p.id} comunidadeSlug={slug} />
              </>
            )}
            {dono && p.status === "pendente" && (
              <div className="mt-2 flex gap-2">
                <button type="button" className="btn-primario" onClick={() => moderarPost(p.id, true)}>
                  Aprovar
                </button>
                <button type="button" className="btn-secundario" onClick={() => moderarPost(p.id, false)}>
                  Recusar
                </button>
              </div>
            )}
          </article>
        );
      })}

      <div className="card p-4">
        <h2 className="font-bold">Quem está aqui</h2>
        <input
          value={buscaMembro}
          onChange={(e) => setBuscaMembro(e.target.value)}
          placeholder="Buscar quem está aqui"
          className="mt-2 w-full rounded-full border border-[var(--borda)] px-4 py-2 text-sm"
        />
        <ul className="mt-2 space-y-2">
          {membros
            .filter((u) => !buscaMembro.trim() || `${u.nome} ${u.cidade}`.toLowerCase().includes(buscaMembro.toLowerCase()))
            .map((u) => (
            <li key={u.id} className="flex items-center gap-3">
              <Link href={`/perfil/${u.id}`}>
                <Avatar usuario={u} size={40} />
              </Link>
              <div className="flex-1">
                <Link href={`/perfil/${u.id}`} className="text-sm font-semibold hover:underline">
                  {u.nome}
                </Link>
                <span className="text-xs text-[var(--texto-3)]"> · {u.cidade}</span>
              </div>
              {dono && u.id !== eu.id && (
                <button type="button" className="btn-secundario" onClick={() => removerMembro(slug, u.id)}>
                  Excluir
                </button>
              )}
            </li>
          ))}
        </ul>
        {dono && estado.pedidos.filter((p) => p.slug === slug).length > 0 && (
          <div className="mt-4 border-t border-[var(--borda)] pt-3">
            <p className="font-bold">Pedidos para entrar</p>
            {estado.pedidos
              .filter((p) => p.slug === slug)
              .map((p) => {
                const u = getUsuario(p.userId);
                if (!u) return null;
                return (
                  <div key={p.userId} className="mt-2 flex items-center gap-2">
                    <Avatar usuario={u} size={32} />
                    <span className="flex-1 text-sm">{u.nome}</span>
                    <button type="button" className="btn-primario" onClick={() => aprovarEntrada(slug, p.userId, true)}>
                      Aceitar
                    </button>
                    <button type="button" className="btn-secundario" onClick={() => aprovarEntrada(slug, p.userId, false)}>
                      Recusar
                    </button>
                  </div>
                );
              })}
          </div>
        )}
      </div>
      <ul className="space-y-3">
        {lista.map((t) => (
          <li key={t.id} className="card p-4">
            <Link href={`/comunidades/${slug}/topicos/${t.id}`} className="font-bold hover:underline">
              {t.titulo}
            </Link>
            <p className="mt-1 text-sm text-[var(--texto-3)]">
              {getUsuario(t.autorId)?.nome} · {t.respostas.length} respostas
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
