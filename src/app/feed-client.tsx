"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PainelEu } from "@/components/PainelEu";
import { BarraPost } from "@/components/BarraPost";
import { Comentarios } from "@/components/Comentarios";
import { FotoComunidade } from "@/components/FotoComunidade";
import { StoriesBar } from "@/components/StoriesBar";
import { getComunidade } from "@/data/mock";
import { usePingu } from "@/lib/store";

export function FeedClient() {
  const { estado, getUsuario, publicarFeed, comunidades, feedOrdenado, recomendados } = usePingu();
  const [texto, setTexto] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [erro, setErro] = useState("");
  const [comentarEm, setComentarEm] = useState("");
  const [ampliar, setAmpliar] = useState<{ src: string; video?: boolean } | null>(null);
  const gente = recomendados.slice(0, 5);
  const minhas = comunidades.filter((c) => {
    const eu = getUsuario(estado.euId);
    return eu?.comunidades.includes(c.slug);
  }).slice(0, 4);

  return (
    <div className="grid min-w-0 gap-5 grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)_280px]">
      <aside className="hidden lg:block">
        <PainelEu />
      </aside>

      <section className="space-y-4">
        <form
          id="composer"
          className="card p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setErro("");
            if (!texto.trim() && !arquivo) {
              setErro("Escreve algo ou escolhe uma foto.");
              return;
            }
            if (!arquivo) {
              const r = await publicarFeed(texto.trim() || " ");
              if (r !== "ok") {
                setErro(r);
                return;
              }
              setTexto("");
              return;
            }
            if (arquivo.size > 1_500_000) {
              setErro("Arquivo grande. Foto ou vídeo menor que 1,5 MB.");
              return;
            }
            const reader = new FileReader();
            const video = arquivo.type.startsWith("video");
            reader.onload = async () => {
              const r = await publicarFeed(texto.trim() || (video ? "Vídeo" : "Foto"), String(reader.result), video, arquivo.name);
              if (r !== "ok") {
                setErro(r);
                return;
              }
              setTexto("");
              setArquivo(null);
              setPreview("");
            };
            reader.readAsDataURL(arquivo);
          }}
        >
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            rows={2}
            className="w-full resize-none rounded-xl border-0 bg-transparent p-1 text-sm outline-none"
            placeholder="Que tal compartilhar algo com a galera?"
          />
          {preview && arquivo?.type.startsWith("video") && (
            <video src={preview} className="mt-2 max-h-40 w-full rounded-xl" controls />
          )}
          {preview && arquivo?.type.startsWith("image") && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="mt-2 max-h-40 rounded-xl object-cover" />
          )}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <label className="btn-secundario cursor-pointer">
              Foto
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setArquivo(f);
                  setPreview(f ? URL.createObjectURL(f) : "");
                }}
              />
            </label>
            <span className="rounded-full border border-[#f3d4e0] px-3 py-2 text-sm text-[#9a6b7c]">Vídeo · em breve</span>
            <button type="submit" className="btn-primario ml-auto">
              Publicar
            </button>
          </div>
          {erro && <p className="mt-2 text-sm text-[var(--rosa-escuro)]">{erro}</p>}
        </form>

        <div className="card p-4">
          <StoriesBar />
        </div>

        {estado.campanhas.filter((c) => {
          if (c.status !== "aprovado") return false;
          const eu = getUsuario(estado.euId);
          if (!eu) return false;
          if (c.alvoCidade && c.alvoCidade.trim() && eu.cidade.toLowerCase() !== c.alvoCidade.trim().toLowerCase()) return false;
          if (c.alvoUf && eu.uf && eu.uf !== c.alvoUf) return false;
          if (c.idadeMin && eu.idade < Number(c.idadeMin)) return false;
          if (c.idadeMax && eu.idade > Number(c.idadeMax)) return false;
          return true;
        }).slice(0, 2).map((ad) => (
          <article key={ad.id} className="card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wide text-[var(--texto-3)]">Pinguads</p>
            {ad.midia && (ad.video ? <video src={ad.midia} className="mt-2 max-h-64 w-full rounded-xl object-cover" /> : <img src={ad.midia} alt="" className="mt-2 max-h-64 w-full rounded-xl object-cover" />)}
            <p className="mt-1 font-bold">{ad.nome}</p>
            <p className="text-sm text-[var(--texto-2)]">{ad.texto}</p>
            <a href={ad.url} target="_blank" rel="noreferrer" className="btn-primario mt-3 inline-block">Saiba mais</a>
          </article>
        ))}
        {feedOrdenado.map((post) => {
            const autor = getUsuario(post.autorId);
            if (!autor) return null;
            return (
              <article key={post.id} className="card overflow-hidden">
                <div className="flex items-center gap-3 p-4 pb-2">
                  <Avatar usuario={autor} size={64} />
                  <div>
                    <Link href={`/perfil/${autor.id}`} className="text-sm font-bold hover:underline">
                      {autor.nome}
                    </Link>
                    <p className="text-xs text-[var(--texto-3)]">{autor.cidade}</p>
                  </div>
                </div>
                {(post.tipo === "foto" || post.midia) && (
                  <>
                    {post.video && post.midia ? (
                      <button type="button" className="block w-full bg-[#1a1216]" onClick={() => setAmpliar({ src: post.midia!, video: true })}>
                        <video src={post.midia} className="aspect-[3/4] w-full object-cover" />
                      </button>
                    ) : post.midia ? (
                      <button type="button" className="block w-full bg-[#1a1216]" onClick={() => setAmpliar({ src: post.midia! })}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={post.midia} alt="" className="aspect-[3/4] w-full object-cover" />
                      </button>
                    ) : null}
                    <div className="p-4">
                      <p className="text-sm">{post.legenda}</p>


                      <div className="mt-2 flex flex-wrap gap-2">
                        {post.comunidades.map((s) => (
                          <Link key={s} href={`/comunidades/${s}`} className="chip">
                            {getComunidade(s)?.nome}
                          </Link>
                        ))}
                      </div>
                      <div className="mt-3">
                        <BarraPost
                          postId={post.id}
                          autorId={post.autorId}
                          onComentar={() => setComentarEm(comentarEm === post.id ? "" : post.id)}
                        />
                        {comentarEm === post.id && <Comentarios postId={post.id} />}
                      </div>
                    </div>
                  </>
                )}
                {post.tipo === "atividade" && (
                  <p className="px-4 pb-4 text-sm text-[var(--texto-2)]">
                    {autor.nome} {post.texto}
                  </p>
                )}
                {post.tipo === "topico" && (
                  <div className="p-4 pt-1 text-sm">
                    <p className="font-bold">{post.titulo}</p>
                  </div>
                )}
              </article>
            );
          })}
      </section>

      <aside className="space-y-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Pessoas novas pra conhecer</h2>
            <Link href="/gente" className="text-xs font-bold text-[#ff4f8b]">
              Ver mais
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {gente.map((u) => (
              <li key={u.id} className="flex items-center gap-3">
                <Link href={`/perfil/${u.id}`}>
                  <Avatar usuario={u} size={64} />
                </Link>
                <div>
                  <Link href={`/perfil/${u.id}`} className="text-sm font-bold hover:underline">
                    {u.nome}
                  </Link>
                  <p className="text-xs text-[var(--texto-3)]">{u.cidade}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold">Comunidades em alta</h2>
            <Link href="/comunidades" className="text-xs font-bold text-[#ff4f8b]">
              Ver mais
            </Link>
          </div>
          <ul className="mt-3 space-y-3">
            {minhas.map((c) => (
              <li key={c.slug} className="flex items-center gap-3">
                <FotoComunidade comunidade={c} size={64} />
                <Link href={`/comunidades/${c.slug}`} className="text-sm hover:underline">
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/comunidades" className="btn-primario mt-4 block text-center">
            Criar comunidade
          </Link>
        </div>
      </aside>
      {ampliar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" onClick={() => setAmpliar(null)}>
          {ampliar.video ? (
            <video src={ampliar.src} controls autoPlay className="max-h-[90vh] max-w-full" onClick={(e) => e.stopPropagation()} />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ampliar.src} alt="" className="max-h-[90vh] max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}
    </div>
  );
}
