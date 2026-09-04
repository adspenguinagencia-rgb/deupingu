"use client";

import { type Campanha, usePingu } from "@/lib/store";
import { useState } from "react";

const custos: Record<Campanha["objetivo"], number> = {
  Reconhecimento: 0.08,
  Tráfego: 0.12,
  Engajamento: 0.1,
  Leads: 0.25,
  App: 0.4,
  Vendas: 2,
};

export default function PinguadsPage() {
  const { estado, eu, criarCampanha, pausarCampanha } = usePingu();
  const minhas = estado.campanhas.filter((c) => c.donoId === eu.id);
  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState<Campanha["objetivo"]>("Tráfego");
  const [publico, setPublico] = useState("");
  const [local, setLocal] = useState("");
  const [idadeMin, setIdadeMin] = useState("18");
  const [idadeMax, setIdadeMax] = useState("45");
  const [alvoCidade, setAlvoCidade] = useState("");
  const [alvoUf, setAlvoUf] = useState("");
  const [texto, setTexto] = useState("");
  const [url, setUrl] = useState("");
  const [tipoOrc, setTipoOrc] = useState<"diario" | "total">("total");
  const [orcamento, setOrcamento] = useState("50");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [midia, setMidia] = useState("");
  const [video, setVideo] = useState(false);
  const [msg, setMsg] = useState("");
  const custo = custos[objetivo];
  const maxConv = Math.floor(Number(orcamento || 0) / custo);
  const fotosPerfil = [eu.avatar, ...(eu.fotos || [])].filter(
    (f) => typeof f === "string" && (f.startsWith("http") || f.startsWith("data:"))
  );

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">Pinguads</h1>
      <p className="text-sm text-[var(--texto-2)]">
        Crie várias campanhas. Cada uma tem resultado separado. Dinheiro não compra aprovação.
      </p>

      <div className="card p-4 text-sm">
        <p className="font-bold">Formatos aceitos na Deu Pingu e no Pinguads</p>
        <ul className="mt-2 space-y-1 text-[var(--texto-2)]">
          <li>Feed vertical: 1080 × 1350 (4:5)</li>
          <li>Feed quadrado: 1080 × 1080 (1:1)</li>
          <li>Feed paisagem: 1080 × 566 (16:9)</li>
          <li>Stories e Reels: 1080 × 1920 (9:16)</li>
          <li>Foto de perfil: 320 × 320 (1:1)</li>
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4">
          <p className="text-xs text-[var(--texto-3)]">Saldo</p>
          <p className="text-2xl font-extrabold">R$ {estado.saldoAds.toFixed(2)}</p>
          <button type="button" className="btn-secundario mt-2" disabled>
            PIX — EM BREVE
          </button>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--texto-3)]">Custo desta conversão</p>
          <p className="text-2xl font-extrabold">R$ {custo.toFixed(2)}</p>
        </div>
        <div className="card p-4">
          <p className="text-xs text-[var(--texto-3)]">Conversões no valor</p>
          <p className="text-2xl font-extrabold">{maxConv}</p>
        </div>
      </div>

      <form
        className="card space-y-2 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          const r = criarCampanha({
            nome,
            objetivo,
            publico,
            local,
            idade: `${idadeMin}-${idadeMax}`,
            idadeMin,
            idadeMax,
            alvoCidade,
            alvoUf,
            texto,
            url,
            orcamento: Number(orcamento) || 0,
            tipoOrcamento: tipoOrc,
            inicio,
            fim,
            midia,
            video,
          });
          setMsg(r === "ok" ? "Campanha criada. Veja o resultado abaixo." : r);
          if (r === "ok") {
            setNome("");
            setTexto("");
            setUrl("");
            setMidia("");
          }
        }}
      >
        <p className="font-bold">Nova campanha</p>
        <input required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da campanha" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <select value={objetivo} onChange={(e) => setObjetivo(e.target.value as Campanha["objetivo"])} className="w-full rounded-xl border px-3 py-2 text-sm">
          {Object.keys(custos).map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <input value={publico} onChange={(e) => setPublico(e.target.value)} placeholder="Público-alvo" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input value={local} onChange={(e) => setLocal(e.target.value)} placeholder="Localização" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input value={alvoCidade} onChange={(e) => setAlvoCidade(e.target.value)} placeholder="Cidade alvo" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <select value={alvoUf} onChange={(e) => setAlvoUf(e.target.value)} className="w-full rounded-xl border px-3 py-2 text-sm">
          <option value="">Todos os estados</option>
          {"AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ").map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <input type="number" min={18} value={idadeMin} onChange={(e) => setIdadeMin(e.target.value)} placeholder="Idade mín" className="w-full rounded-xl border px-3 py-2 text-sm" />
          <input type="number" min={18} value={idadeMax} onChange={(e) => setIdadeMax(e.target.value)} placeholder="Idade máx" className="w-full rounded-xl border px-3 py-2 text-sm" />
        </div>
        <textarea required value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Texto principal" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL DESTINO" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <div className="flex gap-2">
          <button type="button" className={tipoOrc === "diario" ? "btn-primario" : "btn-secundario"} onClick={() => setTipoOrc("diario")}>
            Valor investido diário
          </button>
          <button type="button" className={tipoOrc === "total" ? "btn-primario" : "btn-secundario"} onClick={() => setTipoOrc("total")}>
            Valor investido total
          </button>
        </div>
        <input type="number" min={10} value={orcamento} onChange={(e) => setOrcamento(e.target.value)} placeholder="Valor em reais" className="w-full rounded-xl border px-3 py-2 text-sm" />
        <label className="text-xs">Iniciar dia
          <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
        <label className="text-xs">Finalizar dia
          <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
        <label className="btn-secundario inline-block cursor-pointer">
          Upload foto ou vídeo
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              setVideo(f.type.startsWith("video"));
              const r = new FileReader();
              r.onload = () => setMidia(String(r.result));
              r.readAsDataURL(f);
            }}
          />
        </label>
        {fotosPerfil.length > 0 && (
          <div>
            <p className="text-xs font-semibold">Ou use foto do perfil</p>
            <div className="mt-2 flex gap-2 overflow-x-auto">
              {fotosPerfil.map((f) => (
                <button key={f} type="button" onClick={() => { setMidia(f); setVideo(false); }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f} alt="" className={`h-16 w-16 rounded-xl object-cover ${midia === f ? "ring-2 ring-[#ff4f8b]" : ""}`} />
                </button>
              ))}
            </div>
          </div>
        )}
        {midia && (
          <div className="relative inline-block">
            {video ? <video src={midia} className="h-28 rounded-xl" /> : <img src={midia} alt="" className="h-28 rounded-xl object-cover" />}
            <button type="button" className="absolute -right-2 -top-2 rounded-full bg-black px-2 text-white" onClick={() => { setMidia(""); setVideo(false); }}>
              ×
            </button>
          </div>
        )}
        <p className="text-xs text-[var(--texto-3)]">
          Valor = conversões válidas × R$ {custo.toFixed(2)}. {tipoOrc === "diario" ? "Limite por dia" : "Limite total"} R$ {Number(orcamento || 0).toFixed(2)}.
        </p>
        {msg && <p className="text-sm">{msg}</p>}
        <button className="btn-primario" type="submit">
          Criar outra campanha
        </button>
      </form>

      <h2 className="text-lg font-extrabold">Resultados por campanha</h2>
      <div className="space-y-2">
        {minhas.map((c) => (
          <article key={c.id} className="card overflow-hidden">
            {c.midia && (c.video ? <video src={c.midia} className="h-40 w-full object-cover" /> : <img src={c.midia} alt="" className="h-40 w-full object-cover" />)}
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-bold">{c.nome}</p>
                  <p className="text-sm">{c.texto}</p>
                  <p className="text-xs text-[var(--texto-3)]">
                    {c.objetivo} · {c.status} · {c.tipoOrcamento === "diario" ? "diário" : "total"} R$ {c.orcamento.toFixed(2)}
                  </p>
                  <p className="text-xs text-[var(--texto-3)]">
                    {c.inicio || "—"} até {c.fim || "—"} · URL {c.url || "sem destino"}
                  </p>
                  {c.motivo && <p className="mt-1 text-xs text-[var(--rosa-escuro)]">{c.motivo}</p>}
                </div>
                {(c.status === "aprovado" || c.status === "pausado") && (
                  <button type="button" className="btn-secundario" onClick={() => pausarCampanha(c.id)}>
                    {c.status === "pausado" ? "Retomar" : "Pausar"}
                  </button>
                )}
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-[#fff0f5] p-2">
                  <p className="font-extrabold">{c.conversoes}</p>
                  <p>Conversões</p>
                </div>
                <div className="rounded-xl bg-[#fff0f5] p-2">
                  <p className="font-extrabold">R$ {c.gasto.toFixed(2)}</p>
                  <p>Gasto</p>
                </div>
                <div className="rounded-xl bg-[#fff0f5] p-2">
                  <p className="font-extrabold">R$ {(c.orcamento - c.gasto).toFixed(2)}</p>
                  <p>Restante</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
