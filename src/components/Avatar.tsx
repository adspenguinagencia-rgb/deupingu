import type { Usuario } from "@/data/mock";

export function Avatar({
  usuario,
  size = 40,
  anel = false,
}: {
  usuario: Usuario;
  size?: number;
  anel?: boolean;
}) {
  const cls = anel ? "ring-2 ring-[var(--rosa-principal)] ring-offset-2" : "";
  if (usuario.avatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={usuario.avatar}
        alt={usuario.nome}
        className={`rounded-full object-cover ${cls}`}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full text-white font-bold ${cls}`}
      style={{ width: size, height: size, background: usuario.avatarCor, fontSize: size * 0.32 }}
    >
      {usuario.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
    </div>
  );
}
