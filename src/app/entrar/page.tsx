"use client";

import { type Intencao } from "@/data/mock";
import { ADMIN_EMAIL, usePingu } from "@/lib/store";
import { TEXTO_REGRAS } from "@/lib/moderacao";
import { useRouter } from "next/navigation";
import { useState } from "react";

const intencoes: Intencao[] = [
  "Relacionamento",
  "Aberto a conhecer",
  "Só amizade",
  "Não sei ainda",
  "Só tô olhando, prometo",
  "Casado",
  "Só trabalho",
];

export default function EntrarPage() {
  const { entrar, login, sair, eu, estado, apagarConta, pedirReset } = usePingu();
  const [linkReset, setLinkReset] = useState("");
  const router = useRouter();
  const [modo, setModo] = useState<"cadastro" | "login" | "esqueci">("cadastro");
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [intencao, setIntencao] = useState<Intencao>("Relacionamento");
  const [idade, setIdade] = useState("25");
  const [sexo, setSexo] = useState<"homem" | "mulher" | "outro">("homem");
  const [idadePublica, setIdadePublica] = useState(true);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");
  const [aceitou, setAceitou] = useState(false);

  return (
    <div className="mx-auto max-w-md card p-6">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">
        {modo === "cadastro" ? "Cadastrar" : modo === "login" ? "Entrar" : "Esqueci a senha"}
      </h1>
      <p className="mt-2 text-sm text-[var(--texto-2)]">
        Cadastro com CPF e senha. O dono entra com e-mail.
      </p>
      {estado.euId ? (
        <p className="mt-1 text-sm">Agora você está como <b>{eu.nome}</b>.</p>
      ) : (
        <p className="mt-1 text-sm">Cria uma conta com CPF e senha para entrar.</p>
      )}
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className={modo === "cadastro" ? "btn-primario" : "btn-secundario"} onClick={() => setModo("cadastro")}>
          Cadastrar
        </button>
        <button type="button" className={modo === "login" ? "btn-primario" : "btn-secundario"} onClick={() => setModo("login")}>
          Já tenho conta
        </button>
        <button type="button" className={modo === "esqueci" ? "btn-primario" : "btn-secundario"} onClick={() => setModo("esqueci")}>
          Esqueci a senha
        </button>
      </div>

      {modo === "esqueci" ? (
        <form
          className="mt-4 space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            setErro("");
            setOk("");
            setLinkReset("");
            const r = pedirReset(email);
            if ("erro" in r) return setErro(r.erro);
            setOk("Link criado. O site ainda não tem servidor de e-mail, então o link aparece aqui. Abre ele para mudar a senha.");
            setLinkReset(r.link || "");
          }}
        >
          <p className="text-sm">Digite o e-mail da conta. O link para mudar a senha aparece embaixo.</p>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail cadastrado" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
          {erro && <p className="text-sm text-[var(--rosa-escuro)]">{erro}</p>}
          {ok && <p className="text-sm">{ok}</p>}
          {linkReset && (
            <div className="space-y-2 rounded-xl bg-[#fff0f5] p-3">
              <p className="break-all text-xs">{linkReset}</p>
              <a className="btn-primario inline-block" href={linkReset}>
                Abrir link e mudar senha
              </a>
              <button
                type="button"
                className="btn-secundario"
                onClick={() => navigator.clipboard.writeText(linkReset)}
              >
                Copiar link
              </button>
            </div>
          )}
          <button className="btn-primario w-full" type="submit">
            Enviar link
          </button>
        </form>
      ) : (
        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setErro("");
            if (modo === "cadastro" && senha !== senha2) return setErro("As duas senhas precisam ser iguais.");
            if (modo === "cadastro" && !aceitou) return setErro("Marca Li e concordo para criar a conta.");
            if (modo === "cadastro" && (!cidade.trim() || !uf)) return setErro("Cidade e estado são obrigatórios.");
            const r =
              modo === "login"
                ? await login(email, senha)
                : await entrar({
                    nome,
                    cidade,
                    uf,
                    intencao,
                    email,
                    senha,
                    idade: Number(idade) || 25,
                    sexo,
                    idadePublica,
                  });
            if (r !== "ok") setErro(r);
            else router.push(email.trim().toLowerCase() === ADMIN_EMAIL || email.includes("@") && email.toLowerCase().includes("adspenguin") ? "/admin" : "/");
          }}
        >
          {modo === "cadastro" && (
            <>
              <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
              <input required value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
              <select required value={uf} onChange={(e) => setUf(e.target.value)} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm">
                <option value="">Estado</option>
                {"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ").map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={intencao} onChange={(e) => setIntencao(e.target.value as Intencao)} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm">
                {intencoes.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
              <select value={sexo} onChange={(e) => setSexo(e.target.value as "homem" | "mulher" | "outro")} className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm">
                <option value="homem">Homem</option>
                <option value="mulher">Mulher</option>
                <option value="outro">Outro</option>
              </select>
              <input type="number" min={18} value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={idadePublica} onChange={(e) => setIdadePublica(e.target.checked)} />
                Mostrar idade no perfil
              </label>
            </>
          )}
          <input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="CPF ou e-mail do dono" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
          <input required type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
          {modo === "login" && (
            <button type="button" className="text-sm font-semibold text-[#ff4f8b]" onClick={() => setModo("esqueci")}>
              Esqueci a senha
            </button>
          )}
          {modo === "cadastro" && (
            <>
              <input required type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Repete a senha" className="w-full rounded-xl border border-[var(--borda)] px-3 py-2 text-sm" />
              <pre className="max-h-40 overflow-auto whitespace-pre-wrap rounded-xl bg-[#fff0f5] p-3 text-[11px]">{TEXTO_REGRAS}</pre>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={aceitou} onChange={(e) => setAceitou(e.target.checked)} />
                Li e concordo
              </label>
            </>
          )}
          {erro && <p className="text-sm text-[var(--rosa-escuro)]">{erro}</p>}
          <button className="btn-primario w-full" type="submit">
            {modo === "cadastro" ? "Criar conta" : "Entrar"}
          </button>
        </form>
      )}

      <button type="button" className="btn-secundario mt-3 w-full" onClick={sair}>
        Sair da conta
      </button>
      <button
        type="button"
        className="mt-3 w-full text-sm text-[var(--rosa-escuro)] underline"
        onClick={() => {
          if (confirm("Apagar sua conta deste navegador?")) {
            apagarConta();
            router.push("/entrar");
          }
        }}
      >
        Sair da rede social (apagar minha conta)
      </button>
    </div>
  );
}
