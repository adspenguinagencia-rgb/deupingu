"use client";

import { usePingu } from "@/lib/store";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const peles = ["#F9D3B4", "#E8B98A", "#E0A070", "#C68642", "#8D5524", "#5C3317", "#FFD1DC"];
const cabelosCor = ["#1A1208", "#3E2723", "#6D4C41", "#F9A825", "#EF6C00", "#EC407A", "#6A1B9A", "#00838F", "#ECEFF1"];
const rostos = ["redondo", "oval", "quadrado", "coracao"] as const;
const cortes = ["curto", "medio", "longo", "cacheado", "cacheado-longo", "topete", "liso-lado", "raspado"] as const;
const roupas = ["camiseta", "moletom", "social", "orkut", "regata"] as const;
const olhos = ["abertos", "piscando", "coracao"] as const;
const bocas = ["sorriso", "serio", "beijo"] as const;
const extras = ["nenhum", "oculos", "laco", "bone"] as const;

function svgAvatar(o: {
  pele: string;
  rosto: (typeof rostos)[number];
  corte: (typeof cortes)[number];
  corCabelo: string;
  roupa: (typeof roupas)[number];
  olho: (typeof olhos)[number];
  boca: (typeof bocas)[number];
  extra: (typeof extras)[number];
}) {
  const face =
    o.rosto === "quadrado"
      ? `<rect x="78" y="68" width="124" height="118" rx="24" fill="url(#pele)"/>`
      : o.rosto === "oval"
        ? `<ellipse cx="140" cy="128" rx="56" ry="66" fill="url(#pele)"/>`
        : o.rosto === "coracao"
          ? `<path d="M140 186 C90 148 84 108 108 94 C124 84 140 100 140 100 C140 100 156 84 172 94 C196 108 190 148 140 186 Z" fill="url(#pele)"/>`
          : `<circle cx="140" cy="128" r="62" fill="url(#pele)"/>`;

  const cabelo =
    o.corte === "raspado"
      ? ""
      : o.corte === "topete"
        ? `<path d="M78 130 C90 40 190 40 202 130 L186 120 C170 70 110 70 94 120 Z" fill="${o.corCabelo}"/>`
        : o.corte === "longo"
          ? `<path d="M68 140 C70 40 210 40 212 140 L218 250 L190 230 L90 230 L62 250 Z" fill="${o.corCabelo}"/><path d="M78 118 C90 55 190 55 202 118" fill="${o.corCabelo}"/>`
          : o.corte === "cacheado"
            ? `<circle cx="86" cy="92" r="22" fill="${o.corCabelo}"/><circle cx="118" cy="72" r="24" fill="${o.corCabelo}"/><circle cx="154" cy="68" r="24" fill="${o.corCabelo}"/><circle cx="190" cy="90" r="22" fill="${o.corCabelo}"/>`
            : o.corte === "cacheado-longo"
              ? `<circle cx="80" cy="96" r="24" fill="${o.corCabelo}"/><circle cx="116" cy="70" r="26" fill="${o.corCabelo}"/><circle cx="158" cy="68" r="26" fill="${o.corCabelo}"/><circle cx="196" cy="96" r="24" fill="${o.corCabelo}"/><circle cx="72" cy="150" r="20" fill="${o.corCabelo}"/><circle cx="208" cy="150" r="20" fill="${o.corCabelo}"/><circle cx="70" cy="200" r="18" fill="${o.corCabelo}"/><circle cx="210" cy="200" r="18" fill="${o.corCabelo}"/>`
              : o.corte === "liso-lado"
                ? `<path d="M72 128 C80 48 200 70 208 140 L200 128 C188 78 100 58 80 118 Z" fill="${o.corCabelo}"/>`
                : o.corte === "medio"
                  ? `<path d="M70 138 C72 48 208 48 210 138 L210 175 C200 145 80 145 70 175 Z" fill="${o.corCabelo}"/>`
                  : `<path d="M78 128 C82 62 198 62 202 128 L190 122 C176 82 104 82 90 122 Z" fill="${o.corCabelo}"/>`;

  const camisa =
    o.roupa === "moletom"
      ? `<path d="M48 280 L72 214 L208 214 L232 280 Z" fill="url(#roupa)"/><rect x="122" y="214" width="36" height="22" fill="#2E1A12"/>`
      : o.roupa === "social"
        ? `<path d="M52 280 L80 216 L200 216 L228 280 Z" fill="#1565C0"/><path d="M140 216 L128 280 L152 280 Z" fill="#E3F2FD"/>`
        : o.roupa === "orkut"
          ? `<path d="M50 280 L76 216 L204 216 L230 280 Z" fill="url(#rosa)"/><circle cx="140" cy="248" r="14" fill="#FCE4EC"/>`
          : o.roupa === "regata"
            ? `<path d="M84 280 L102 222 L178 222 L196 280 Z" fill="#26A69A"/>`
            : `<path d="M54 280 L82 218 L198 218 L226 280 Z" fill="#43A047"/>`;

  const olho =
    o.olho === "piscando"
      ? `<path d="M108 142 Q118 148 128 142" stroke="#3E2723" fill="none" stroke-width="4"/><ellipse cx="162" cy="144" rx="10" ry="12" fill="#fff"/><circle cx="164" cy="145" r="5" fill="#3E2723"/>`
      : o.olho === "coracao"
        ? `<path d="M118 148 C108 136 96 144 108 156 L118 164 L128 156 C140 144 128 136 118 148 Z" fill="#EC407A"/><path d="M162 148 C152 136 140 144 152 156 L162 164 L172 156 C184 144 172 136 162 148 Z" fill="#EC407A"/>`
        : `<ellipse cx="116" cy="144" rx="11" ry="13" fill="#fff"/><circle cx="118" cy="146" r="6" fill="#3E2723"/><circle cx="120" cy="143" r="2" fill="#fff"/><ellipse cx="164" cy="144" rx="11" ry="13" fill="#fff"/><circle cx="166" cy="146" r="6" fill="#3E2723"/><circle cx="168" cy="143" r="2" fill="#fff"/>`;

  const boca =
    o.boca === "serio"
      ? `<path d="M122 186 H158" stroke="#6D4C41" stroke-width="4" stroke-linecap="round"/>`
      : o.boca === "beijo"
        ? `<ellipse cx="140" cy="188" rx="8" ry="6" fill="#E91E63"/>`
        : `<path d="M118 180 Q140 198 162 180" stroke="#6D4C41" fill="none" stroke-width="4" stroke-linecap="round"/>`;

  const extra =
    o.extra === "oculos"
      ? `<circle cx="116" cy="146" r="18" fill="none" stroke="#212121" stroke-width="4"/><circle cx="164" cy="146" r="18" fill="none" stroke="#212121" stroke-width="4"/><path d="M134 146 H146" stroke="#212121" stroke-width="4"/>`
      : o.extra === "laco"
        ? `<path d="M140 78 L118 58 L140 70 L162 58 Z" fill="#EC407A"/>`
        : o.extra === "bone"
          ? `<ellipse cx="140" cy="88" rx="62" ry="18" fill="#1565C0"/><rect x="88" y="78" width="104" height="18" rx="6" fill="#0D47A1"/>`
          : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" width="420" height="420">
    <defs>
      <radialGradient id="bg" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#fff"/><stop offset="100%" stop-color="#F8BBD0"/></radialGradient>
      <radialGradient id="pele" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#fff6ee"/><stop offset="55%" stop-color="${o.pele}"/><stop offset="100%" stop-color="#6D4C41" stop-opacity=".25"/></radialGradient>
      <linearGradient id="roupa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#8D6E63"/><stop offset="100%" stop-color="#3E2723"/></linearGradient>
      <linearGradient id="rosa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#F48FB1"/><stop offset="100%" stop-color="#C2185B"/></linearGradient>
    </defs>
    <rect width="280" height="280" rx="36" fill="url(#bg)"/>
    ${cabelo}
    ${camisa}
    ${face}
    <ellipse cx="108" cy="150" rx="16" ry="8" fill="#E91E63" opacity=".18"/>
    <ellipse cx="172" cy="150" rx="16" ry="8" fill="#E91E63" opacity=".18"/>
    ${olho}
    ${boca}
    ${extra}
  </svg>`;
}

export default function PinguCaraPage() {
  const { setFoto } = usePingu();
  const router = useRouter();
  const [pele, setPele] = useState(peles[1]);
  const [rosto, setRosto] = useState<(typeof rostos)[number]>("redondo");
  const [corte, setCorte] = useState<(typeof cortes)[number]>("longo");
  const [corCabelo, setCorCabelo] = useState(cabelosCor[0]);
  const [roupa, setRoupa] = useState<(typeof roupas)[number]>("orkut");
  const [olho, setOlho] = useState<(typeof olhos)[number]>("abertos");
  const [boca, setBoca] = useState<(typeof bocas)[number]>("sorriso");
  const [extra, setExtra] = useState<(typeof extras)[number]>("nenhum");

  const svg = useMemo(
    () => svgAvatar({ pele, rosto, corte, corCabelo, roupa, olho, boca, extra }),
    [pele, rosto, corte, corCabelo, roupa, olho, boca, extra]
  );
  const url = "data:image/svg+xml;utf8," + encodeURIComponent(svg);

  function grupo(titulo: string, itens: readonly string[], atual: string, set: (v: never) => void) {
    return (
      <div>
        <p className="font-bold">{titulo}</p>
        <div className="mt-1 flex flex-wrap gap-2">
          {itens.map((r) => (
            <button key={r} type="button" className={atual === r ? "btn-primario" : "btn-secundario"} onClick={() => set(r as never)}>
              {r}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="text-2xl font-extrabold text-[var(--rosa-escuro)]">PinguCara</h1>
      <p className="text-sm text-[var(--texto-2)]">Mais cabelo, rosto, olho e acessório. Volume 3D no desenho.</p>
      <div className="card flex justify-center p-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={url} alt="PinguCara" className="h-64 w-64 drop-shadow-xl" />
      </div>
      <div className="card space-y-4 p-4 text-sm">
        {grupo("Rosto", rostos, rosto, setRosto)}
        <div>
          <p className="font-bold">Pele</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {peles.map((c) => (
              <button key={c} type="button" className="h-8 w-8 rounded-full border" style={{ background: c }} onClick={() => setPele(c)} />
            ))}
          </div>
        </div>
        {grupo("Cabelo", cortes, corte, setCorte)}
        <div>
          <p className="font-bold">Cor do cabelo</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {cabelosCor.map((c) => (
              <button key={c} type="button" className="h-8 w-8 rounded-full border" style={{ background: c }} onClick={() => setCorCabelo(c)} />
            ))}
          </div>
        </div>
        {grupo("Olhos", olhos, olho, setOlho)}
        {grupo("Boca", bocas, boca, setBoca)}
        {grupo("Roupa", roupas, roupa, setRoupa)}
        {grupo("Extra", extras, extra, setExtra)}
        <button
          type="button"
          className="btn-primario"
          onClick={() => {
            setFoto(url);
            router.push("/");
          }}
        >
          Usar como foto de perfil
        </button>
      </div>
    </div>
  );
}
