"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoPingu } from "./LogoPingu";
import { Avatar } from "./Avatar";
import { usePingu } from "@/lib/store";

export function HeaderPingu() {
  const path = usePathname();
  const router = useRouter();
  const { eu, estado, ehMatch, sair, ehAdmin } = usePingu();
  const recadosNovos = estado.scraps.filter((s) => s.para === eu.id).length;
  const coracoesNovos = estado.crushes.filter((c) => c.para === eu.id && !ehMatch(c.de, eu.id)).length;
  const msgsNovas = estado.mensagens.filter((m) => m.para === eu.id).length;

  const nav = [
    { href: "/", label: "Feed" },
    { href: "/comunidades", label: "Comunidade" },
    { href: `/perfil/${eu.id}`, label: "Perfil" },
    { href: "/pinguads", label: "Ads" },
    ...(ehAdmin ? [{ href: "/admin", label: "Painel" }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <LogoPingu />
            <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-[#ff5a9a]">
              Deu Pingu
            </span>
          </Link>
          <nav className="mx-auto hidden items-center gap-1 md:flex">
            {nav.map((l) => {
              const feedAtivo = l.href === "/" && path === "/";
              const outro = l.href !== "/" && path.startsWith(l.href);
              const on = feedAtivo || outro;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    on ? "bg-[#ff5a9a] text-white" : "text-[#7a5a66] hover:bg-[#fff0f5]"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Link href="/conversas" className="relative grid h-9 w-9 place-items-center text-lg" title="Mensagens">
              💬
              {msgsNovas + recadosNovos + coracoesNovos > 0 && (
                <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#ff5a9a] px-1 text-[10px] font-bold text-white">
                  {msgsNovas + recadosNovos + coracoesNovos}
                </span>
              )}
            </Link>
            <Link href={`/perfil/${eu.id}`}>
              <Avatar usuario={eu} size={36} />
            </Link>
            <button
              type="button"
              onClick={() => {
                sair();
                router.push("/entrar");
              }}
              className="text-[#7a5a66]"
              title="Sair"
            >
              ↪
            </button>
          </div>
        </div>
      </header>
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 border-t border-[#f3d4e0] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <Link href="/" className="py-3 text-center text-xs font-extrabold text-[#ff5a9a]">
          Feed
        </Link>
        <Link href="/comunidades" className="py-3 pr-3 text-center text-xs font-extrabold text-[#ff5a9a]">
          Comunidade
        </Link>
        <Link href="/conversas" className="border-l-2 border-[#ffd0e0] py-3 pl-3 text-center text-xs font-extrabold text-[#ff5a9a]">
          Msg
        </Link>
        <Link href="/pinguads" className="py-3 text-center text-xs font-extrabold text-[#ff5a9a]">
          Ads
        </Link>
        <Link href={`/perfil/${eu.id}`} className="py-3 text-center text-xs font-extrabold text-[#ff5a9a]">
          Perfil
        </Link>
      </nav>
    </>
  );
}
