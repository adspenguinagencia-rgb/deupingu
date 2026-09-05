"use client";

import { usePingu } from "@/lib/store";
import { useState } from "react";

export function MenuExcluir({ postId, autorId }: { postId: string; autorId: string }) {
  const { eu, apagarPost } = usePingu();
  const [aberto, setAberto] = useState(false);
  if (autorId !== eu.id) return null;
  return (
    <div className="absolute right-1 top-1 z-10">
      <button
        type="button"
        className="flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-lg leading-none text-white"
        onClick={(e) => {
          e.stopPropagation();
          setAberto((v) => !v);
        }}
        aria-label="Mais"
      >
        ⋮
      </button>
      {aberto && (
        <button
          type="button"
          className="absolute right-0 top-9 rounded-lg bg-white px-3 py-2 text-sm font-bold text-[#c2185b] shadow"
          onClick={(e) => {
            e.stopPropagation();
            apagarPost(postId);
            setAberto(false);
          }}
        >
          Excluir
        </button>
      )}
    </div>
  );
}

export function EditarPost({ postId, autorId, legenda }: { postId: string; autorId: string; legenda?: string }) {
  const { eu, editarPost } = usePingu();
  const [aberto, setAberto] = useState(false);
  const [txt, setTxt] = useState(legenda || "");
  const [msg, setMsg] = useState("");
  if (autorId !== eu.id) return null;
  return (
    <div className="mt-2">
      {!aberto ? (
        <button type="button" className="btn-secundario" onClick={() => setAberto(true)}>
          Editar
        </button>
      ) : (
        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const r = editarPost(postId, txt);
            if (r !== "ok") setMsg(r);
            else setAberto(false);
          }}
        >
          <textarea value={txt} onChange={(e) => setTxt(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm" rows={3} />
          {msg && <p className="text-xs text-[var(--rosa-escuro)]">{msg}</p>}
          <button className="btn-primario" type="submit">
            Salvar descrição
          </button>
        </form>
      )}
    </div>
  );
}
