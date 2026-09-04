"use client";

import Link from "next/link";
import { use, useState } from "react";
import { AcoesPerfil } from "@/components/AcoesPerfil";
import { CardPerfil } from "@/components/CardPerfil";
import { FotoPerfil } from "@/components/FotoPerfil";
import { VotosOrkut } from "@/components/VotosOrkut";
import { AlbumPerfil } from "@/components/AlbumPerfil";
import { CrushRecebidos } from "@/components/CrushRecebidos";
import { EditarPerfil } from "@/components/EditarPerfil";
import { DenunciarConta } from "@/components/DenunciarConta";
import { comunidades } from "@/data/mock";
import { usePingu } from "@/lib/store";

export default function PerfilPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { eu, getUsuario, estado, aceitarDepoimento, ehMatch } = usePingu();
  const usuario = getUsuario(id);
  const [aba, setAba] = useState<"recados" | "depoimentos" | "comunidades" | "fotos">("fotos");

  if (!usuario) return <p>Perfil não encontrado.</p>;

  const scrapsPerfil = estado.scraps.filter((s) => s.para === usuario.id && s.publico);
  const deps = estado.depoimentos.filter((d) => d.para === usuario.id && d.status === "publicado");
  const pendentes = estado.depoimentos.filter((d) => d.para === usuario.id && d.status === "pendente");
  const comms = comunidades.filter((c) => usuario.comunidades.includes(c.slug));
  const proprio = usuario.id === eu.id;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="card overflow-hidden">
        <div className="h-28" style={{ background: usuario.acento }} />
        <div className="-mt-10 px-5 pb-5">
          {(usuario.id === eu.id ? eu.avatar : usuario.avatar) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={(usuario.id === eu.id ? eu.avatar : usuario.avatar) || ""} alt="" className="h-32 w-32 rounded-full object-cover ring-4 ring-white" />
          ) : (
            <div
              className="flex h-32 w-32 items-center justify-center rounded-full text-3xl font-bold text-white ring-4 ring-white"
              style={{ background: usuario.avatarCor }}
            >
              {usuario.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
          )}
          <h1 className="mt-3 text-2xl font-extrabold">{usuario.nome}</h1>
          {usuario.apelido && <p className="text-sm font-semibold text-[#ff4f8b]">@{usuario.apelido}</p>}
          <p className="text-sm text-[var(--texto-2)]">
            {usuario.cidade}{usuario.uf ? ` · ${usuario.uf}` : ""}
            {usuario.idadePublica !== false || usuario.id === eu.id ? ` · ${usuario.idade} anos` : ""}
            {usuario.sexo ? ` · ${usuario.sexo}` : ""}
            {usuario.id === eu.id && usuario.idadePublica === false ? " (idade só você vê)" : ""}
          </p>
          <span className="chip mt-2 inline-block">{usuario.intencao}</span>
          {ehMatch(eu.id, usuario.id) && (
            <p className="mt-2 font-bold text-[var(--rosa-escuro)]">Deu Pingu com você.</p>
          )}

          <VotosOrkut alvoId={usuario.id} />

          <p className="mt-4 text-sm leading-relaxed text-[var(--texto-2)]">{usuario.quemSouEu}</p>
          {proprio && <EditarPerfil />}
          <AcoesPerfil alvoId={usuario.id} />
          <DenunciarConta alvoId={usuario.id} />
          {proprio && <CrushRecebidos />}
        </div>
      </div>

      <AlbumPerfil userId={usuario.id} />

      <div className="flex flex-wrap gap-2">
        {(["recados", "depoimentos", "comunidades", "fotos"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAba(a)}
            className={aba === a ? "btn-primario capitalize" : "btn-secundario capitalize"}
          >
            {a}
          </button>
        ))}
      </div>

      {aba === "recados" && (
        <div className="space-y-3">
          {scrapsPerfil.map((s) => (
            <div key={s.id} className="card p-4 text-sm">
              <Link href={`/perfil/${s.de}`} className="font-bold hover:underline">
                {getUsuario(s.de)?.nome}
              </Link>
              <p className="mt-1">{s.texto}</p>
            </div>
          ))}
          {scrapsPerfil.length === 0 && <p className="text-sm text-[var(--texto-3)]">Nenhum scrap público ainda.</p>}
        </div>
      )}

      {aba === "depoimentos" && (
        <div className="space-y-3">
          {proprio &&
            pendentes.map((d) => (
              <div key={d.id} className="card p-4 text-sm">
                <p className="font-bold">Aceita esse depoimento? Lembra: se aceitar, vai pro perfil.</p>
                <p className="mt-2">“{d.texto}”</p>
                <p className="mt-1 text-[var(--texto-3)]">— {getUsuario(d.de)?.nome}</p>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="btn-primario" onClick={() => aceitarDepoimento(d.id, true)}>
                    Aceitar
                  </button>
                  <button type="button" className="btn-secundario" onClick={() => aceitarDepoimento(d.id, false)}>
                    Recusar
                  </button>
                </div>
              </div>
            ))}
          {deps.map((d) => (
            <div key={d.id} className="card p-4 text-sm">
              {d.topo && <span className="chip mb-2 inline-block">Topo</span>}
              <p>“{d.texto}”</p>
              <Link href={`/perfil/${d.de}`} className="mt-2 inline-block font-semibold text-[var(--rosa-escuro)]">
                {getUsuario(d.de)?.nome}
              </Link>
            </div>
          ))}
        </div>
      )}

      {aba === "comunidades" && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {comms.map((c) => (
            <li key={c.slug} className="card p-3">
              <Link href={`/comunidades/${c.slug}`} className="font-semibold hover:underline">
                {c.nome}
              </Link>
              <p className="text-xs text-[var(--texto-3)]">{c.membros}</p>
            </li>
          ))}
        </ul>
      )}

      {aba === "fotos" && (
        <p className="text-sm text-[var(--texto-3)]">
          Em cima ficam só as fotos e os vídeos que essa pessoa publicou. Quadrado vazio some até ter mídia.
        </p>
      )}

      <CardPerfil usuario={usuario} />
    </div>
  );
}
