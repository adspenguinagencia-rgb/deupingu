"use client";

import Link from "next/link";
import { Avatar } from "./Avatar";
import { usePingu } from "@/lib/store";

export function PainelEu() {
  const { eu } = usePingu();
  return (
    <aside className="card overflow-hidden">
      <div className="h-16 bg-[#ff5a9a]" />
      <div className="-mt-8 flex flex-col items-center px-4 pb-5">
        <Avatar usuario={eu} size={72} anel />
        <p className="mt-2 font-extrabold">{eu.nome.split(" ")[0]}</p>
        <p className="text-sm text-[var(--texto-3)]">{eu.cidade}</p>
        <Link href={`/perfil/${eu.id}`} className="mt-3 w-full rounded-full bg-[#ffe4ef] py-2 text-center text-sm font-bold text-[#c2185b]">
          Ver meu perfil
        </Link>
      </div>
    </aside>
  );
}
