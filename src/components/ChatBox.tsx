"use client";

import { usePingu } from "@/lib/store";
import { useState } from "react";

export function ChatBox({ comId }: { comId: string }) {
  const { eu, getUsuario, ehMatch, mensagensCom, mandarMsg } = usePingu();
  const [texto, setTexto] = useState("");
  const outro = getUsuario(comId);
  if (!outro || !ehMatch(eu.id, comId)) return null;
  const msgs = mensagensCom(comId);

  return (
    <div className="card p-4">
      <h2 className="font-bold text-[var(--rosa-escuro)]">Chat com {outro.nome}</h2>
      <p className="text-xs text-[var(--texto-3)]">Deu Pingo! Vocês se acharam entre uma comunidade e um scrap.</p>
      <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
        {msgs.length === 0 && <p className="text-sm text-[var(--texto-3)]">Manda a primeira mensagem.</p>}
        {msgs.map((m) => (
          <p
            key={m.id}
            className={`rounded-xl p-2 text-sm ${m.de === eu.id ? "bg-[var(--rosa-fundo)] ml-8" : "bg-white border border-[var(--borda)] mr-8"}`}
          >
            {m.texto}
          </p>
        ))}
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!texto.trim()) return;
          mandarMsg(comId, texto.trim());
          setTexto("");
        }}
      >
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          className="flex-1 rounded-full border border-[var(--borda)] px-3 py-2 text-sm"
          placeholder="Escreve no chat…"
        />
        <button className="btn-primario" type="submit">
          Enviar
        </button>
      </form>
    </div>
  );
}
