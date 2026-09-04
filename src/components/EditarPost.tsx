"use client";

import { usePingu } from "@/lib/store";
import { useState } from "react";

export function EditarPost({ postId, autorId, legenda }: { postId: string; autorId: string; legenda?: string }) {
  const { eu, editarPost, apagarPost } = usePingu();
  const [aberto, setAberto] = useState(false);
  const [txt, setTxt] = useState(legenda || "");
  const [msg, setMsg] = useState("");
  if (autorId !== eu.id) return null;
  return (
    <div className="mt-2">
      {!aberto ? (
        <div className="flex gap-2">
          <button type="button" className="btn-secundario" onClick={() => setAberto(true)}>
            Editar
          </button>
          <button type="button" className="btn-secundario" onClick={() => apagarPost(postId)}>
            Excluir
          </button>
        </div>
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
