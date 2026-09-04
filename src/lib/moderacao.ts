const termos = [
  "nude",
  "nudes",
  "nua",
  "nuas",
  "pelad",
  "porn",
  "porno",
  "pornô",
  "sexo explícito",
  "conteudo sexual",
  "conteúdo sexual",
  "onlyfans",
  "pack",
  "racis",
  "preconceit",
  "discrimina",
  "discurso de odio",
  "discurso de ódio",
  "macaco",
  "nazis",
  "hitler",
  "mate você",
  "te mato",
  "vou te matar",
  "ameaça",
  "ameaca",
  "estupro",
  "assedio",
  "assédio",
  "persegui",
];

export function checarTexto(texto: string): string | null {
  const t = (texto || "").toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  for (const p of termos) {
    const n = p.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    if (n && t.includes(n)) {
      if (["nude", "nudes", "nua", "nuas", "pelad", "porn", "porno", "pack", "onlyfans"].some((x) => n.includes(x) || t.includes(x))) {
        return "Esta imagem ou texto não pode ser publicado porque viola as regras da comunidade (nudez ou conteúdo sexual).";
      }
      if (["racis", "preconceit", "discrimina", "odio", "macaco", "nazis", "hitler"].some((x) => n.includes(x) || t.includes(x))) {
        return "Conteúdo com racismo, preconceito ou ódio não é permitido.";
      }
      return "Conteúdo com ofensa, ameaça ou assédio não é permitido.";
    }
  }
  return null;
}

export function checarArquivo(nome?: string): string | null {
  if (!nome) return null;
  return checarTexto(nome.replace(/\.[a-z0-9]+$/i, " ").replace(/[_-]+/g, " "));
}

export function checarPublicacao(texto: string, nomeArquivo?: string): string | null {
  return checarTexto(texto) || checarArquivo(nomeArquivo);
}

export const TEXTO_REGRAS = `Regras da comunidade Deu Pingu
1. Sem nudes ou conteúdo sexual explícito em foto, vídeo, recado, perfil ou comentário.
2. Foto proibida é bloqueada na hora.
3. Sem racismo, preconceito ou discurso de ódio.
4. Sem ofensa, ameaça, assédio ou perseguição.
5. Qualquer pessoa pode denunciar uma conta.
6. 5 denúncias válidas = bloqueio de 7 dias.
7. Depois do bloqueio, mais 5 denúncias em 30 dias = exclusão permanente.`;
