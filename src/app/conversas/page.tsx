"use client";

import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { ChatBox } from "@/components/ChatBox";
import { usePingu } from "@/lib/store";
import { useMemo, useState } from "react";

export default function ConversasPage() {
  const { eu, estado, getUsuario, crush, recusarCrush, ehMatch, mandarScrap } = usePingu();
  const [com, setCom] = useState("");
  const [resposta, setResposta] = useState<Record<string, string>>({});

  const recados = useMemo(
    () => estado.scraps.filter((s) => s.de === eu.id || s.para === eu.id),
    [estado.scraps, eu.id]
  );
  const coracoes = estado.crushes.filter((c) => c.para === eu.id || c.de === eu.id);
  const pessoasChat = useMemo(() => {
    const ids = new Set<string>();
    estado.mensagens.forEach((m) => {
      if (m.de === eu.id) ids.add(m.para);
      if (m.para === eu.id) ids.add(m.de);
    });
    estado.crushes.forEach((c) => {
      if (ehMatch(c.de, c.para) && (c.de === eu.id || c.para === eu.id)) {
        ids.add(c.de === eu.id ? c.para : c.de);
      }
    });
    return [...ids].map((id) => getUsuario(id)).filter(Boolean);
  }, [estado.mensagens, estado.crushes, eu.id, ehMatch, getUsuario]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">Mensagens</h1>

      <section className="card space-y-4 p-4">
        <h2 className="font-bold">♥ Corações</h2>
        {coracoes.length === 0 && <p className="text-sm text-[var(--texto-3)]">Nenhum crush ainda.</p>}
        {coracoes.map((c, i) => {
          const outroId = c.de === eu.id ? c.para : c.de;
          const outro = getUsuario(outroId);
          if (!outro) return null;
          const match = ehMatch(c.de, c.para);
          const recebi = c.para === eu.id && !match;
          return (
            <div key={c.de + c.para + i} className="flex items-start gap-3">
              <Link href={`/perfil/${outro.id}`}>
                <Avatar usuario={outro} size={48} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/perfil/${outro.id}`} className="font-bold hover:underline">
                  {outro.nome}
                </Link>
                <p className="text-sm text-[var(--texto-2)]">
                  {c.de === eu.id
                    ? match
                      ? "Deu Pingu! Crush secreto mútuo."
                      : "Você mandou crush secreto."
                    : match
                      ? "Deu Pingu! Vocês se acharam."
                      : "Mandou um crush secreto."}
                </p>
                {recebi && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button type="button" className="btn-primario" onClick={() => crush(c.de)}>
                      Mandar crush de volta
                    </button>
                    <button type="button" className="btn-secundario" onClick={() => recusarCrush(c.de)}>
                      Não
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="card space-y-4 p-4">
        <h2 className="font-bold">Recados</h2>
        {recados.length === 0 && <p className="text-sm text-[var(--texto-3)]">Nenhum recado.</p>}
        {recados.map((s) => {
          const outroId = s.de === eu.id ? s.para : s.de;
          const outro = getUsuario(outroId);
          if (!outro) return null;
          const recebi = s.para === eu.id;
          return (
            <div key={s.id} className="flex items-start gap-3 rounded-2xl bg-[#fff0f5] p-3">
              <Link href={`/perfil/${outro.id}`}>
                <Avatar usuario={outro} size={48} />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/perfil/${outro.id}`} className="font-bold hover:underline">
                  {outro.nome}
                </Link>
                <p className="text-xs text-[var(--texto-3)]">{recebi ? "mandou um recado" : "você enviou"}</p>
                <p className="mt-1 text-sm">{s.texto}</p>
                {recebi && (
                  <form
                    className="mt-2 flex gap-2"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const t = (resposta[s.id] || "").trim();
                      if (!t) return;
                      mandarScrap(s.de, t);
                      setResposta((r) => ({ ...r, [s.id]: "" }));
                    }}
                  >
                    <input
                      value={resposta[s.id] || ""}
                      onChange={(e) => setResposta((r) => ({ ...r, [s.id]: e.target.value }))}
                      className="flex-1 rounded-full border border-[var(--borda)] px-3 py-1.5 text-sm"
                      placeholder="Responder recado…"
                    />
                    <button className="btn-primario" type="submit">
                      Enviar
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </section>

      <section className="card space-y-3 p-4">
        <h2 className="font-bold">Conversas</h2>
        {pessoasChat.length === 0 && (
          <p className="text-sm text-[var(--texto-3)]">Chat abre depois do Deu Pingu.</p>
        )}
        <div className="flex flex-wrap gap-2">
          {pessoasChat.map((u) =>
            u ? (
              <button
                key={u.id}
                type="button"
                className={`flex items-center gap-2 rounded-full px-2 py-1 ${com === u.id ? "bg-[#ff5a9a] text-white" : "bg-[#ffe4ef]"}`}
                onClick={() => setCom(u.id)}
              >
                <Avatar usuario={u} size={28} />
                <span className="text-sm font-semibold">{u.nome.split(" ")[0]}</span>
              </button>
            ) : null
          )}
        </div>
        {com && <ChatBox comId={com} />}
      </section>
    </div>
  );
}
