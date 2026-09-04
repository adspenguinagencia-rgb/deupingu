"use client";

import Link from "next/link";
import { usePingu } from "@/lib/store";

export function CrushRecebidos() {
  const { eu, estado, getUsuario, crush, recusarCrush, ehMatch } = usePingu();
  const pedidos = estado.crushes.filter((c) => c.para === eu.id && !ehMatch(c.de, eu.id));
  if (pedidos.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl bg-[var(--rosa-fundo)] p-3 text-sm">
      <p className="font-bold">Crush secreto recebido</p>
      {pedidos.map((c) => {
        const quem = getUsuario(c.de);
        return (
          <div key={c.de} className="mt-2 flex flex-wrap items-center gap-2">
            <Link href={`/perfil/${c.de}`} className="font-semibold underline">
              {quem?.nome || c.de}
            </Link>
            <span>mandou um ♥</span>
            <button type="button" className="btn-primario" onClick={() => crush(c.de)}>
              Mandar de volta
            </button>
            <button type="button" className="btn-secundario" onClick={() => recusarCrush(c.de)}>
              Não
            </button>
          </div>
        );
      })}
    </div>
  );
}
