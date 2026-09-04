"use client";

import { usePingu } from "@/lib/store";

export function VotosOrkut({ alvoId }: { alvoId: string }) {
  const { eu, votar, jaVotou, getUsuario } = usePingu();
  const u = getUsuario(alvoId);
  if (!u) return null;
  const proprio = alvoId === eu.id;
  const itens = [
    ["legal", "Legal", u.avaliacoes.legal, "#E1F5FE"],
    ["confiavel", "Confiável", u.avaliacoes.confiavel, "#F1F8E9"],
    ["sexy", "Sexy", u.avaliacoes.sexy, "#FCE4EC"],
  ] as const;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
      {itens.map(([tipo, nome, valor, bg]) => (
        <button
          key={tipo}
          type="button"
          disabled={proprio || jaVotou(alvoId, tipo)}
          onClick={() => votar(alvoId, tipo)}
          className="rounded-xl p-2 disabled:opacity-70"
          style={{ background: bg }}
        >
          <div className="font-bold">{nome}</div>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/70">
            <div className="h-full bg-[var(--rosa-principal)]" style={{ width: `${valor}%` }} />
          </div>
          <div className="mt-1 text-[10px] text-[var(--texto-3)]">
            {proprio ? "sua nota" : jaVotou(alvoId, tipo) ? "você já votou" : "clica para votar"}
          </div>
        </button>
      ))}
    </div>
  );
}
