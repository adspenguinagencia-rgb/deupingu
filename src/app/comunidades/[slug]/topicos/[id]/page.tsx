import Link from "next/link";
import { getComunidade, getUsuario, topicos } from "@/data/mock";

export default async function TopicoPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const comunidade = getComunidade(slug);
  const topico = topicos.find((t) => t.id === id && t.comunidadeSlug === slug);

  if (!comunidade || !topico) return <p>Tópico não encontrado.</p>;

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Link href={`/comunidades/${slug}`} className="text-sm text-[var(--rosa-escuro)] hover:underline">
        ← {comunidade.nome}
      </Link>
      <article className="card p-5">
        <h1 className="text-xl font-extrabold">{topico.titulo}</h1>
        <p className="mt-1 text-sm text-[var(--texto-3)]">{getUsuario(topico.autorId)?.nome}</p>
        <p className="mt-3 text-sm leading-relaxed">{topico.corpo}</p>
      </article>
      {topico.respostas.map((r, i) => (
        <article key={i} className="card p-4 text-sm">
          <Link href={`/perfil/${r.autorId}`} className="font-bold hover:underline">
            {getUsuario(r.autorId)?.nome}
          </Link>
          <p className="mt-1">{r.texto}</p>
        </article>
      ))}
      <div className="card p-4">
        <textarea
          rows={3}
          className="w-full rounded-xl border border-[var(--borda)] bg-[var(--rosa-fundo-2)] p-3 text-sm"
          placeholder="Responder sem corrente, pelo amor."
        />
        <button type="button" className="btn-primario mt-2">
          Responder
        </button>
      </div>
    </div>
  );
}
