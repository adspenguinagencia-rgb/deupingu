"use client";

import { Avatar } from "@/components/Avatar";
import { usePingu } from "@/lib/store";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

export function StoriesBar() {
  const { eu, storiesAtivas, addStory, apagarStory, getUsuario } = usePingu();
  const [aberto, setAberto] = useState(false);
  const [pos, setPos] = useState(0);
  const [erro, setErro] = useState("");

  const fila = useMemo(() => {
    const ids = Array.from(new Set(storiesAtivas.map((s) => s.autorId)));
    return ids.flatMap((id) => storiesAtivas.filter((s) => s.autorId === id));
  }, [storiesAtivas]);

  const autores = useMemo(() => {
    const ids = Array.from(new Set(storiesAtivas.map((s) => s.autorId)));
    return ids.map((id) => getUsuario(id)).filter(Boolean);
  }, [storiesAtivas, getUsuario]);

  const atual = fila[pos];

  function fechar() {
    setAberto(false);
  }

  function proximo() {
    if (pos + 1 < fila.length) setPos(pos + 1);
    else fechar();
  }

  function anterior() {
    if (pos > 0) setPos(pos - 1);
  }

  function abrirAutor(id: string) {
    const i = fila.findIndex((s) => s.autorId === id);
    setPos(i < 0 ? 0 : i);
    setAberto(true);
  }

  useEffect(() => {
    if (!aberto || !atual) return;
    const t = setTimeout(proximo, 15000);
    return () => clearTimeout(t);
  }, [aberto, pos, atual?.id]);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowRight") proximo();
      if (e.key === "ArrowLeft") anterior();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [aberto, pos, fila.length]);

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory">
        <label className="flex w-[23%] min-w-[23%] shrink-0 snap-start cursor-pointer flex-col items-center gap-1">
          <Avatar usuario={eu} size={88} anel />
          <span className="w-full truncate text-center text-sm font-semibold">+ Story</span>
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setErro("");
              const video = f.type.startsWith("video");
              if (video) {
                const url = URL.createObjectURL(f);
                const el = document.createElement("video");
                el.preload = "metadata";
                el.onloadedmetadata = () => {
                  URL.revokeObjectURL(url);
                  if (el.duration > 20) {
                    setErro("Vídeo do story no máximo 20 segundos.");
                    return;
                  }
                  const r = new FileReader();
                  r.onload = () => addStory(String(r.result), true, f.name);
                  r.readAsDataURL(f);
                };
                el.src = url;
              } else {
                const r = new FileReader();
                r.onload = () => addStory(String(r.result), false, f.name);
                r.readAsDataURL(f);
              }
            }}
          />
        </label>
        {autores.map((u) =>
          u ? (
            <button key={u.id} type="button" onClick={() => abrirAutor(u.id)} className="flex w-[23%] min-w-[23%] shrink-0 snap-start flex-col items-center gap-1">
              <Avatar usuario={u} size={88} anel />
              <span className="w-full truncate text-center text-sm font-semibold">{u.nome.split(" ")[0]}</span>
            </button>
          ) : null
        )}
      </div>
      {erro && <p className="mt-1 text-xs text-[var(--rosa-escuro)]">{erro}</p>}

      {aberto &&
        createPortal(
        <div className="fixed inset-0 z-[9999] bg-black">
          <button type="button" className="absolute right-4 top-4 z-[90] rounded-full bg-white/20 px-3 py-1 text-white" onClick={fechar}>
            Fechar ✕
          </button>
          <button type="button" className="absolute left-2 top-1/2 z-[90] -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-2xl text-white" onClick={anterior}>
            ‹
          </button>
          <button type="button" className="absolute right-2 top-1/2 z-[90] -translate-y-1/2 rounded-full bg-white/20 px-3 py-2 text-2xl text-white" onClick={proximo}>
            ›
          </button>

          <div className="flex h-full flex-col items-center justify-center px-12">
            <div className="mb-3 flex w-full max-w-sm gap-1">
              {fila.map((s, i) => (
                <div key={s.id} className={`h-1 flex-1 rounded ${i <= pos ? "bg-white" : "bg-white/30"}`} />
              ))}
            </div>
            {atual?.video ? (
              <video src={atual.midia} autoPlay playsInline className="max-h-[75vh] w-full max-w-sm rounded-xl object-contain" />
            ) : atual?.midia ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={atual.midia} alt="" className="max-h-[75vh] w-full max-w-sm rounded-xl object-contain" />
            ) : (
              <p className="text-white">Story sem foto. Usa a seta ou Fechar.</p>
            )}
            <p className="mt-3 text-sm text-white">{atual ? getUsuario(atual.autorId)?.nome : ""}</p>
            {atual?.autorId === eu.id && (
              <button
                type="button"
                className="btn-secundario mt-2"
                onClick={() => {
                  apagarStory(atual.id);
                  if (fila.length <= 1) fechar();
                  else setPos(Math.min(pos, fila.length - 2));
                }}
              >
                Excluir
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
