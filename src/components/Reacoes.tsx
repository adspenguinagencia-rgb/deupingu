"use client";

import { usePingu } from "@/lib/store";

export function Reacoes({ alvo }: { alvo: string }) {
  const { reagir, contaReacao } = usePingu();
  return (
    <div className="flex gap-3 text-sm">
      <button type="button" onClick={() => reagir(alvo, "like")}>
        👍 {contaReacao(alvo, "like")}
      </button>
      <button type="button" onClick={() => reagir(alvo, "dislike")}>
        👎 {contaReacao(alvo, "dislike")}
      </button>
    </div>
  );
}
