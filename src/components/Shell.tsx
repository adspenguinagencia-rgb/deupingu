"use client";

import { HeaderPingu } from "./HeaderPingu";
import { usePingu } from "@/lib/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function Shell({ children }: { children: React.ReactNode }) {
  const { estado, pronto } = usePingu();
  const path = usePathname();
  const router = useRouter();
  const logado = Boolean(estado.euId);

  useEffect(() => {
    if (!pronto) return;
    if (!logado && path !== "/entrar") router.replace("/entrar");
  }, [pronto, logado, path, router]);

  if (!pronto) return <p className="p-8 text-center text-sm">Carregando…</p>;
  if (!logado && path !== "/entrar") return <p className="p-8 text-center text-sm">Vai para o cadastro…</p>;

  return (
    <div className="min-h-screen overflow-x-hidden pb-24 md:pb-8">
      {logado && <HeaderPingu />}
      <main className="mx-auto max-w-6xl px-3 py-4 md:px-4 md:py-6">{children}</main>
    </div>
  );
}
