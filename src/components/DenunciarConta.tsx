"use client";

import { usePingu } from "@/lib/store";
import { useState } from "react";

export function DenunciarConta({ alvoId }: { alvoId: string }) {
  const { eu, denunciarConta } = usePingu();
  const [aberto, setAberto] = useState(false);
  const [motivo, setMotivo] = useState("violação das regras");
  const [msg, setMsg] = useState("");
  if (alvoId === eu.id) return null;
  return (
    <div className="mt-3">
      {!aberto ? (
        <button type="button" className="text-sm underline text-[var(--rosa-escuro)]" onClick={() => setAberto(true)}>
          Denunciar conta
        </button>
      ) : (
        <form
          className="space-y-2 rounded-xl bg-[#fff0f5] p-3 text-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const r = denunciarConta(alvoId, motivo);
            setMsg(r === "ok" ? "Denúncia registrada." : r);
            if (r === "ok") setAberto(false);
          }}
        >
          <p className="font-bold">Denunciar conta</p>
          <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full rounded-xl border px-2 py-1">
            <option>nudez ou conteúdo sexual</option>
            <option>racismo ou discriminação</option>
            <option>ofensa, ameaça ou assédio</option>
            <option>violação das regras</option>
          </select>
          <button className="btn-primario" type="submit">
            Enviar denúncia
          </button>
        </form>
      )}
      {msg && <p className="mt-1 text-xs">{msg}</p>}
    </div>
  );
}
