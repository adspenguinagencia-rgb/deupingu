"use client";

import { useState } from "react";
import { Reacoes } from "@/components/Reacoes";
import { usePingu } from "@/lib/store";

export function Comentarios({ postId, comunidadeSlug }: { postId: string; comunidadeSlug?: string }) {
  const { estado, eu, getUsuario, comentar, ehDono, moderarComentario } = usePingu();
  const [texto, setTexto] = useState("");
  const dono = comunidadeSlug ? ehDono(comunidadeSlug) : false;
  const lista = estado.comentarios.filter((c) => c.postId === postId);

  return (
    <div className="mt-3 space-y-2">
      {lista
        .filter((c) => c.status === "publicado" || dono || c.autorId === eu.id)
        .map((c) => (
          <div key={c.id} className="rounded-xl bg-[var(--rosa-fundo-2)] p-2 text-sm">
            <p>
              <b>{getUsuario(c.autorId)?.nome}</b> {c.status === "pendente" && "(aguardando dono)"}
            </p>
            <p>{c.texto}</p>
            {c.status === "publicado" && <Reacoes alvo={"com-" + c.id} />}
            {dono && c.status === "pendente" && (
              <div className="mt-1 flex gap-2">
                <button type="button" className="btn-primario" onClick={() => moderarComentario(c.id, true)}>
                  Aprovar
                </button>
                <button type="button" className="btn-secundario" onClick={() => moderarComentario(c.id, false)}>
                  Recusar
                </button>
              </div>
            )}
          </div>
        ))}
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!texto.trim()) return;
          comentar(postId, texto.trim(), comunidadeSlug);
          setTexto("");
        }}
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="flex-1 rounded-full border border-[var(--borda)] px-3 py-1 text-sm"
          placeholder="Comentar…"
        />
        <button className="btn-primario" type="submit">
          Ok
        </button>
      </form>
    </div>
  );
}
