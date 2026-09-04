"use client";

import { ADMIN_EMAIL, usePingu } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function AdminPage() {
  const { ehAdmin, estado, getUsuario, banirUsuario, usuarios } = usePingu();
  const router = useRouter();
  const mes = "2026-09";
  const anunciosMes = estado.anuncios.filter((a) => a.mes === mes);
  const total = anunciosMes.reduce((s, a) => s + a.valor, 0);
  const cadastrados = useMemo(() => estado.contas.filter((c) => c.email !== ADMIN_EMAIL).length + usuarios.length, [estado.contas, usuarios]);

  if (!ehAdmin) {
    return (
      <div className="card mx-auto max-w-md p-6">
        <p>Só o dono entra aqui.</p>
        <button type="button" className="btn-primario mt-3" onClick={() => router.push("/entrar")}>
          Ir para login
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">Painel do dono</h1>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="card p-4">
          <p className="text-sm text-[var(--texto-3)]">Pessoas na rede</p>
          <p className="text-3xl font-extrabold">{cadastrados}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-[var(--texto-3)]">Anúncios deste mês</p>
          <p className="text-3xl font-extrabold">R$ {total.toFixed(2)}</p>
        </div>
      </div>
      <div className="card p-4">
        <h2 className="font-bold">Anúncios de setembro/2026</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {anunciosMes.map((a) => (
            <li key={a.id} className="flex justify-between">
              <span>{a.quem}</span>
              <b>R$ {a.valor.toFixed(2)}</b>
            </li>
          ))}
        </ul>
      </div>
      <div className="card p-4">
        <h2 className="font-bold">Excluir da rede</h2>
        <ul className="mt-3 space-y-2">
          {usuarios.map((u) => (
            <li key={u.id} className="flex items-center justify-between gap-2 text-sm">
              <span>
                {u.nome} · {u.cidade}
              </span>
              <button type="button" className="btn-secundario" onClick={() => banirUsuario(u.id)}>
                Excluir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
