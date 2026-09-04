"use client";

import { usePingu } from "@/lib/store";

export function BarraPost({
  postId,
  autorId,
  onComentar,
}: {
  postId: string;
  autorId: string;
  onComentar?: () => void;
}) {
  const { eu, reagir, contaReacao, crush, temCrush, ehMatch } = usePingu();
  const match = ehMatch(eu.id, autorId);
  const enviado = temCrush(eu.id, autorId);
  const proprio = autorId === eu.id;

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
      <button type="button" onClick={() => reagir(postId, "like")}>
        ♥ {contaReacao(postId, "like")}
      </button>
      <button type="button" onClick={onComentar}>
        💬 Comentar
      </button>
      {!proprio && (
        <button type="button" onClick={() => crush(autorId)} disabled={enviado && !match}>
          {match ? "♥ Deu Pingu" : enviado ? "Crush secreto enviado" : "Crush secreto"}
        </button>
      )}
    </div>
  );
}
