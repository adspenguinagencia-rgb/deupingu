import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { comuns, comunidades, logado, type Usuario } from "@/data/mock";

export function CardPerfil({
  usuario,
  compacto = false,
}: {
  usuario: Usuario;
  compacto?: boolean;
}) {
  const eu = logado();
  const emComum = usuario.id === eu.id ? usuario.comunidades : comuns(eu.comunidades, usuario.comunidades);
  const nomes = emComum
    .map((s) => comunidades.find((c) => c.slug === s)?.nome)
    .filter(Boolean) as string[];

  return (
    <article className="card overflow-hidden">
      <div className="h-1.5" style={{ background: usuario.acento }} />
      <div className={`p-4 ${compacto ? "" : "p-5"}`}>
        <div className="flex gap-3">
          <Avatar usuario={usuario} size={64} anel />
          <div className="min-w-0">
            <Link href={`/perfil/${usuario.id}`} className="font-bold text-[var(--texto)] hover:underline">
              {usuario.nome}
            </Link>
            <p className="text-sm text-[var(--texto-2)]">
              {usuario.cidade} · {usuario.idade}
            </p>
            <span className="chip mt-1 inline-block">{usuario.intencao}</span>
          </div>
        </div>

        {!compacto && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--texto-2)]">
            {usuario.quemSouEu}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="chip bg-[#E1F5FE] text-[#0277BD]">Legal</span>
          <span className="chip bg-[#F1F8E9] text-[#558B2F]">Confiável</span>
          <span className="chip bg-[var(--rosa-fundo)] text-[var(--rosa-escuro)]">Sexy</span>
        </div>

        {nomes.length > 0 && (
          <p className="mt-3 text-xs text-[var(--texto-3)]">
            {usuario.id === eu.id
              ? `${nomes.length} comunidades`
              : `${nomes.length} comunidades em comum`}
            {nomes.length ? ` · ${nomes.slice(0, 2).join(" · ")}` : ""}
          </p>
        )}

        {!compacto && usuario.id !== eu.id && (
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-primario">
              Recado
            </button>
            <button type="button" className="btn-secundario">
              Depoimento
            </button>
            <button type="button" className="btn-secundario" title="Em breve">
              Crush secreto
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
