"use client";

import { usePingu } from "@/lib/store";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function FormNovaSenha() {
  const { resetComToken } = usePingu();
  const router = useRouter();
  const token = useSearchParams().get("token") || "";
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [erro, setErro] = useState("");

  return (
    <form
      className="mx-auto max-w-md card space-y-3 p-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (senha !== senha2) return setErro("As duas senhas precisam ser iguais.");
        const r = resetComToken(token, senha);
        if (r !== "ok") return setErro(r);
        router.push("/entrar");
      }}
    >
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">Nova senha</h1>
      <input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha nova" className="w-full rounded-xl border px-3 py-2" />
      <input required type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Repete a senha" className="w-full rounded-xl border px-3 py-2" />
      {erro && <p className="text-sm text-[var(--rosa-escuro)]">{erro}</p>}
      <button className="btn-primario w-full" type="submit">
        Salvar senha
      </button>
    </form>
  );
}

export default function NovaSenhaPage() {
  return (
    <Suspense fallback={<p className="p-8 text-center">Carregando…</p>}>
      <FormNovaSenha />
    </Suspense>
  );
}
