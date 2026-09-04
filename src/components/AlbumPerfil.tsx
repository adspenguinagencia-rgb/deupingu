"use client";

import { Reacoes } from "@/components/Reacoes";
import { usePingu } from "@/lib/store";
import { useState } from "react";

type Item = { id: string; midia: string; video: boolean; texto?: string };

export function AlbumPerfil({ userId }: { userId: string }) {
  const { estado, getUsuario } = usePingu();
  const [aberto, setAberto] = useState<Item | null>(null);
  const usuario = getUsuario(userId);

  const midias: Item[] = [
    ...estado.posts
      .filter((p) => p.tipo === "foto" && p.autorId === userId && p.midia)
      .map((p) => ({ id: p.id, midia: p.midia!, video: !!p.video, texto: p.tipo === "foto" ? p.legenda : undefined })),
    ...estado.postsComunidade
      .filter((p) => p.autorId === userId && p.midia && p.status === "publicado")
      .map((p) => ({ id: p.id, midia: p.midia!, video: !!p.video, texto: p.texto })),
  ];

  if (midias.length === 0) {
    return <p className="text-sm text-[var(--texto-3)]">Ainda sem foto ou vídeo publicado.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 sm:gap-2">
        {midias.map((m) => (
          <div key={m.id} className="space-y-1">
            <button type="button" onClick={() => setAberto(m)} className="block w-full">
              {m.video ? (
                <video src={m.midia} className="aspect-square w-full rounded-lg object-cover" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.midia} alt="" className="aspect-square w-full rounded-lg object-cover" />
              )}
            </button>
            {m.texto && <p className="line-clamp-2 px-0.5 text-[11px] text-[var(--texto-2)]">{m.texto}</p>}
            <Reacoes alvo={m.id} />
          </div>
        ))}
      </div>
      {aberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setAberto(null)}>
          <div className="max-h-[90vh] max-w-3xl overflow-auto rounded-2xl bg-white p-4" onClick={(e) => e.stopPropagation()}>
            {aberto.video ? (
              <video src={aberto.midia} controls autoPlay className="max-h-[70vh] w-full rounded-xl" />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={aberto.midia} alt="" className="max-h-[70vh] w-full rounded-xl object-contain" />
            )}
            {aberto.texto && <p className="mt-3 text-sm">{aberto.texto}</p>}
            <p className="mt-1 text-xs text-[var(--texto-3)]">{usuario?.nome}</p>
            <div className="mt-3">
              <Reacoes alvo={aberto.id} />
            </div>
            <button type="button" className="btn-secundario mt-3" onClick={() => setAberto(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
