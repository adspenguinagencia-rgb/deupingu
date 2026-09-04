"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { usePingu } from "@/lib/store";

export default function GentePage() {
  const { eu, recomendados } = usePingu();
  const [q, setQ] = useState("");
  const [sexo, setSexo] = useState("");
  const [soTrabalho, setSoTrabalho] = useState(false);
  const [idadeMin, setIdadeMin] = useState("");
  const [idadeMax, setIdadeMax] = useState("");

  const lista = useMemo(() => {
    return recomendados.filter((u) => {
      if (q.trim() && !`${u.nome} ${u.cidade} ${u.intencao}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (sexo && u.sexo !== sexo) return false;
      if (soTrabalho && u.intencao !== "Só trabalho") return false;
      if (idadeMin && u.idade < Number(idadeMin)) return false;
      if (idadeMax && u.idade > Number(idadeMax)) return false;
      return true;
    });
  }, [recomendados, q, sexo, soTrabalho, idadeMin, idadeMax]);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">Gente do seu jeito</h1>
      <p className="text-sm text-[var(--texto-2)]">
        Sobe quem tem a mesma cidade, idade parecida, mesmas comunidades e o mesmo interesse que {eu.nome.split(" ")[0]}.
      </p>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Buscar nome, cidade ou interesse…"
        className="w-full rounded-full border border-[var(--borda)] bg-white px-4 py-3 text-sm shadow-sm"
      />
      <div className="card flex flex-wrap gap-2 p-3">
        <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="rounded-xl border border-[var(--borda)] px-2 py-1 text-sm">
          <option value="">Todos</option>
          <option value="homem">Homem</option>
          <option value="mulher">Mulher</option>
        </select>
        <label className="flex items-center gap-1 text-sm">
          <input type="checkbox" checked={soTrabalho} onChange={(e) => setSoTrabalho(e.target.checked)} />
          Só trabalho
        </label>
        <input value={idadeMin} onChange={(e) => setIdadeMin(e.target.value)} placeholder="Idade mín" type="number" className="w-24 rounded-xl border border-[var(--borda)] px-2 py-1 text-sm" />
        <input value={idadeMax} onChange={(e) => setIdadeMax(e.target.value)} placeholder="Idade máx" type="number" className="w-24 rounded-xl border border-[var(--borda)] px-2 py-1 text-sm" />
      </div>
      {lista.map((u) => {
        const comuns = u.comunidades.filter((c) => eu.comunidades.includes(c)).length;
        const motivos = [
          u.cidade === eu.cidade ? "mesma cidade" : "",
          Math.abs(u.idade - eu.idade) <= 3 ? "idade parecida" : "",
          comuns ? `${comuns} comunidades em comum` : "",
          u.intencao === eu.intencao ? "mesmo interesse" : "",
        ].filter(Boolean);
        return (
          <Link key={u.id} href={`/perfil/${u.id}`} className="card flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
            <Avatar usuario={u} size={56} />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{u.nome}</p>
              <p className="text-sm text-[var(--texto-3)]">
                {u.cidade}
                {u.idadePublica !== false ? ` · ${u.idade} anos` : ""}
                {u.sexo ? ` · ${u.sexo}` : ""} · {u.intencao}
              </p>
              {motivos.length > 0 && <p className="mt-1 text-xs font-semibold text-[#ff4f8b]">{motivos.join(" · ")}</p>}
            </div>
            <span className="chip">ver perfil</span>
          </Link>
        );
      })}
    </div>
  );
}
