import type { Comunidade } from "@/data/mock";

export function FotoComunidade({
  comunidade,
  size = 40,
  redonda = false,
}: {
  comunidade: Comunidade;
  size?: number;
  redonda?: boolean;
}) {
  const src = comunidade.capa || `https://picsum.photos/seed/${comunidade.slug}/200/200`;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={comunidade.nome}
      className={`object-cover ${redonda ? "rounded-full" : "rounded-xl"}`}
      style={{ width: size, height: size }}
    />
  );
}
