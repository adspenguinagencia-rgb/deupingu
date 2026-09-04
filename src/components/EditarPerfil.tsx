"use client";

import { type Intencao } from "@/data/mock";
import { usePingu } from "@/lib/store";
import { useEffect, useState } from "react";
import { FotoPerfil } from "./FotoPerfil";
import Link from "next/link";

const intencoes: Intencao[] = [
  "Relacionamento",
  "Aberto a conhecer",
  "Só amizade",
  "Não sei ainda",
  "Só tô olhando, prometo",
  "Casado",
  "Só trabalho",
];

export function EditarPerfil() {
  const { eu, editarPerfil, estado, garantirChave } = usePingu();
  useEffect(() => {
    garantirChave();
  }, [eu.id]);
  const chave = estado.contas.find((c) => c.userId === eu.id)?.chave;
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState(eu.nome);
  const [cidade, setCidade] = useState(eu.cidade);
  const [uf, setUf] = useState(eu.uf || "");
  const [idade, setIdade] = useState(String(eu.idade));
  const [sexo, setSexo] = useState(eu.sexo || "outro");
  const [intencao, setIntencao] = useState(eu.intencao);
  const [frase, setFrase] = useState(eu.quemSouEu);
  const [idadePublica, setIdadePublica] = useState(eu.idadePublica !== false);

  const aviso = chave ? (
    <div className="mt-3 rounded-xl border-2 border-[#ff4f8b] bg-white p-3">
      <p className="text-xs font-bold text-[#c2185b]">Anota este código. É o ÚNICO jeito de recuperar a senha se esquecer.</p>
      <p className="mt-1 text-center text-2xl font-extrabold tracking-widest">{chave}</p>
    </div>
  ) : null;

  if (!aberto) {
    return (
      <div>
        {aviso}
        <button type="button" className="btn-secundario mt-3" onClick={() => setAberto(true)}>
          Editar perfil
        </button>
      </div>
    );
  }

  return (
    <form
      className="mt-4 space-y-2 rounded-2xl bg-[#fff0f5] p-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!cidade.trim() || !uf) return;
        await editarPerfil({
          nome: nome.trim() || eu.nome,
          cidade: cidade.trim(),
          uf,
          idade: Number(idade) || eu.idade,
          sexo: sexo as "homem" | "mulher" | "outro",
          intencao,
          quemSouEu: frase.trim(),
          idadePublica,
          apelido: eu.apelido,
        });
        alert("Perfil salvo para todo mundo.");
        setAberto(false);
      }}
    >
      <p className="font-bold">Editar perfil</p>
      {chave && (
        <div className="rounded-xl border-2 border-[#ff4f8b] bg-white p-3">
          <p className="text-xs font-bold text-[#c2185b]">Anota este código. É o ÚNICO jeito de recuperar a senha.</p>
          <p className="mt-1 text-center text-2xl font-extrabold tracking-widest">{chave}</p>
        </div>
      )}
      <FotoPerfil donoId={eu.id} />
      <Link href="/pingu-cara" className="block text-sm font-semibold text-[#ff5a9a]">
        Ou montar PinguCara
      </Link>
      <input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
      <input required value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
      <select required value={uf} onChange={(e) => setUf(e.target.value)} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm">
        <option value="">Estado</option>
        {"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ").map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <input type="number" min={18} value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
      <select value={sexo} onChange={(e) => setSexo(e.target.value as "homem" | "mulher" | "outro")} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm">
        <option value="homem">Homem</option>
        <option value="mulher">Mulher</option>
        <option value="outro">Outro</option>
      </select>
      <select value={intencao} onChange={(e) => setIntencao(e.target.value as Intencao)} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm">
        {intencoes.map((i) => (
          <option key={i}>{i}</option>
        ))}
      </select>
      <textarea
        value={frase}
        onChange={(e) => setFrase(e.target.value)}
        rows={4}
        className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm"
        placeholder="Gosto de foto no fim da tarde..."
      />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={idadePublica} onChange={(e) => setIdadePublica(e.target.checked)} />
        Mostrar idade
      </label>
      <div className="flex gap-2">
        <button className="btn-primario" type="submit">
          Salvar
        </button>
        <button type="button" className="btn-secundario" onClick={() => setAberto(false)}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
