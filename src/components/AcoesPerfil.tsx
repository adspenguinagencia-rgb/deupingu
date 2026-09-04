"use client";

import { usePingu } from "@/lib/store";
import Link from "next/link";
import { useState } from "react";

export function AcoesPerfil({ alvoId }: { alvoId: string }) {
  const { eu, mandarScrap, crush, temCrush, ehMatch, toggleSeguir, segue } = usePingu();
  const [scrap, setScrap] = useState("");

  if (alvoId === eu.id) return null;

  const jaCrush = temCrush(eu.id, alvoId);
  const match = ehMatch(eu.id, alvoId);
  const recebeu = temCrush(alvoId, eu.id);

  return (
    <div className="mt-4 space-y-3">
      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!scrap.trim()) return;
          mandarScrap(alvoId, scrap.trim());
          setScrap("");
        }}
      >
        <label className="text-sm font-bold">Recado</label>
        <textarea
          value={scrap}
          onChange={(e) => setScrap(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-[var(--borda)] bg-[var(--rosa-fundo-2)] p-3 text-sm"
        />
        <button type="submit" className="btn-primario self-start">
          Enviar
        </button>
      </form>

      <button type="button" className="btn-secundario" onClick={() => toggleSeguir(alvoId)}>
        {segue(alvoId) ? "Deixar de seguir" : "Seguir"}
      </button>
      <button type="button" className="btn-crush w-full" onClick={() => crush(alvoId)} disabled={jaCrush && !match}>
        {match ? "♥ Deu Pingo" : jaCrush ? "♥ Crush secreto enviado" : recebeu ? "♥ Mandar crush de volta" : "♥ Crush secreto"}
      </button>

      <Link href="/conversas" className="btn-secundario inline-block">
        Ver mensagens
      </Link>
    </div>
  );
}
