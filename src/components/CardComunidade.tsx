import Link from "next/link";
import { logado, type Comunidade } from "@/data/mock";

export function CardComunidade({ comunidade }: { comunidade: Comunidade }) {
  const eu = logado();
  const facoParte = eu.comunidades.includes(comunidade.slug);

  return (
    <article className="card overflow-hidden">
      {comunidade.capa ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={comunidade.capa} alt="" className="aspect-square w-full object-cover" />
      ) : (
        <div className="aspect-square w-full" style={{ background: comunidade.cor }} />
      )}
      <div className="p-4">
        <Link
          href={`/comunidades/${comunidade.slug}`}
          className="font-bold text-[var(--texto)] hover:underline"
        >
          {comunidade.nome}
        </Link>
        <p className="mt-1 text-sm text-[var(--texto-3)]">{comunidade.membros} membros</p>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--texto-2)]">{comunidade.descricao}</p>
        <div className="mt-3 flex items-center justify-between">
          {facoParte ? (
            <span className="chip">Já faço parte</span>
          ) : (
            <span className="btn-secundario text-xs">Entrar</span>
          )}
        </div>
      </div>
    </article>
  );
}
