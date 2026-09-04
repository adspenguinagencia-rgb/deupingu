export type Intencao =
  | "Aberto a conhecer"
  | "Só amizade"
  | "Relacionamento"
  | "Não sei ainda"
  | "Só tô olhando, prometo"
  | "Casado"
  | "Só trabalho";

export type Usuario = {
  id: string;
  nome: string;
  idade: number;
  cidade: string;
  uf?: string;
  intencao: Intencao;
  quemSouEu: string;
  comunidades: string[];
  avaliacoes: { legal: number; confiavel: number; sexy: number };
  fotos: string[];
  avatarCor: string;
  acento: string;
  avatar?: string;
  sexo?: "homem" | "mulher" | "outro";
  idadePublica?: boolean;
  seguindo?: string[];
};

export type Comunidade = {
  slug: string;
  nome: string;
  membros: string;
  descricao: string;
  cor: string;
  donoId?: string;
  capa?: string;
  restrita?: boolean;
  tipo?: "aberta" | "fechada" | "moderada";
};

export type Post =
  | {
      id: string;
      tipo: "foto";
      autorId: string;
      legenda: string;
      cor: string;
      comunidades: string[];
      curtidas: number;
      comentarios: number;
      midia?: string;
      video?: boolean;
    }
  | {
      id: string;
      tipo: "scrap";
      autorId: string;
      alvoId: string;
      texto: string;
    }
  | {
      id: string;
      tipo: "atividade";
      autorId: string;
      texto: string;
    }
  | {
      id: string;
      tipo: "topico";
      autorId: string;
      comunidadeSlug: string;
      titulo: string;
      respostas: number;
    };

export type Scrap = {
  id: string;
  de: string;
  para: string;
  texto: string;
  publico: boolean;
};

export type Depoimento = {
  id: string;
  de: string;
  para: string;
  texto: string;
  status: "publicado" | "pendente";
  topo?: boolean;
};

export type Topico = {
  id: string;
  comunidadeSlug: string;
  autorId: string;
  titulo: string;
  corpo: string;
  respostas: { autorId: string; texto: string }[];
};

export const comunidades: Comunidade[] = [
  { slug: "eu-odeio-segunda-feira", nome: "Eu odeio segunda-feira", membros: "128 mil", descricao: "Oficialmente o dia mais longo da semana.", cor: "#F48FB1" },
  { slug: "queria-sorvete-mas-era-feijao", nome: "Queria sorvete, mas era feijão", membros: "86 mil", descricao: "Expectativa versus pote reutilizado.", cor: "#89C4E1" },
  { slug: "te-incomodo-que-peena", nome: "Te incomodo? Que peeena!", membros: "94 mil", descricao: "Scrap sem aviso prévio.", cor: "#EC407A" },
  { slug: "sou-legal-nao-to-te-dando-mole", nome: "Sou legal, ñ tô te dando mole", membros: "61 mil", descricao: "Educação não é flerte. Às vezes é.", cor: "#F8BBD0" },
  { slug: "eu-amo-viajar-barato", nome: "Eu amo viajar barato", membros: "73 mil", descricao: "Passagem promo e hostel com gente estranha.", cor: "#81C784" },
  { slug: "00h01-e-a-insonia", nome: "00h01 e a insônia", membros: "55 mil", descricao: "Tópico aberto de madrugada.", cor: "#CE93D8" },
  { slug: "quem-se-define-se-limita", nome: "Quem se define se limita", membros: "41 mil", descricao: "Quem sou eu? Ainda não sei.", cor: "#FFB74D" },
  { slug: "eu-nunca-terminei-uma-borracha", nome: "Eu nunca terminei uma borracha", membros: "38 mil", descricao: "Clássico absoluto.", cor: "#80DEEA" },
  { slug: "desce-e-arrasa", nome: "Deus me disse: desce e arrasa", membros: "49 mil", descricao: "Motivação duvidosa, eficaz.", cor: "#AD1457" },
  { slug: "fotos-sem-flash-no-espelho", nome: "Fotos sem flash no espelho", membros: "33 mil", descricao: "Grid obrigatório.", cor: "#F48FB1" },
  { slug: "orkut-raiz-instagram-pela-metade", nome: "Orkut raiz, Instagram pela metade", membros: "22 mil", descricao: "A casa do PinguOrk.", cor: "#89C4E1" },
  { slug: "quero-namorar-mas-tenho-preguica", nome: "Quero namorar mas tenho preguiça", membros: "67 mil", descricao: "Match amanhã.", cor: "#EC407A" },
  { slug: "cidade-pequena-crush-longe", nome: "Cidade pequena, crush longe", membros: "19 mil", descricao: "Amigo de amigo de outra cidade.", cor: "#A5D6A7" },
  { slug: "playlist-2008", nome: "Playlist de 2008 no repeat", membros: "28 mil", descricao: "A trilha do recado.", cor: "#B39DDB" },
  { slug: "aceito-depoimento", nome: "Aceito depoimento, não aceito exposição", membros: "16 mil", descricao: "Leia antes de aceitar.", cor: "#F48FB1" },
  { slug: "gente-que-responde-scrap", nome: "Gente que responde scrap", membros: "44 mil", descricao: "Espécie em extinção.", cor: "#89C4E1" },
  { slug: "pinguim-tambem-ama", nome: "Pinguim também ama", membros: "12 mil", descricao: "Mascote oficial e os apaixonados.", cor: "#EC407A" },
  { slug: "so-to-olhando", nome: "Só tô olhando, prometo", membros: "51 mil", descricao: "Mentira clássica.", cor: "#FFCC80" },
  { slug: "amigos-de-amigos", nome: "Amigos de amigos de amigos", membros: "36 mil", descricao: "O algoritmo original do Orkut.", cor: "#90CAF9" },
  { slug: "relacionamento-serio-recado-fofo", nome: "Relacionamento sério, recado fofo", membros: "29 mil", descricao: "Intenção clara, scrap sem corrente.", cor: "#F8BBD0" },
];

export const usuarios: Usuario[] = [
  {
    id: "marina",
    nome: "Marina Pinguim",
    idade: 28,
    cidade: "São Paulo",
    intencao: "Relacionamento",
    quemSouEu:
      "Gosto de foto no fim da tarde, comunidade aleatória e gente que responde scrap. Odeio ghosting e corrente. Se mandar depoimento, que seja verdade.",
    comunidades: [
      "eu-odeio-segunda-feira",
      "eu-amo-viajar-barato",
      "orkut-raiz-instagram-pela-metade",
      "quero-namorar-mas-tenho-preguica",
      "gente-que-responde-scrap",
      "pinguim-tambem-ama",
      "relacionamento-serio-recado-fofo",
    ],
    avaliacoes: { legal: 86, confiavel: 82, sexy: 64 },
    fotos: ["#F48FB1", "#89C4E1", "#EC407A", "#FFCC80", "#A5D6A7", "#CE93D8"],
    avatarCor: "#EC407A",
    acento: "#EC407A",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://picsum.photos/seed/bia-feed/600/800",
  },
  {
    id: "joao",
    nome: "João Recado",
    idade: 31,
    cidade: "Campinas",
    intencao: "Só amizade",
    quemSouEu: "Respondo scrap no mesmo dia. Comunidade de segunda é terapia.",
    comunidades: ["eu-odeio-segunda-feira", "te-incomodo-que-peena", "gente-que-responde-scrap"],
    avaliacoes: { legal: 78, confiavel: 88, sexy: 40 },
    fotos: ["#89C4E1", "#90CAF9", "#B0BEC5"],
    avatarCor: "#89C4E1",
    acento: "#89C4E1",
    sexo: "homem",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "leticia",
    nome: "Leticia Topo",
    idade: 26,
    cidade: "Rio de Janeiro",
    intencao: "Aberto a conhecer",
    quemSouEu: "Disputo o topo do depoimento por esporte. Viajo barato e tiro foto no espelho.",
    comunidades: ["eu-amo-viajar-barato", "fotos-sem-flash-no-espelho", "quero-namorar-mas-tenho-preguica", "pinguim-tambem-ama"],
    avaliacoes: { legal: 70, confiavel: 60, sexy: 84 },
    fotos: ["#F8BBD0", "#EC407A", "#FFF0F5", "#FFCC80"],
    avatarCor: "#D81B60",
    acento: "#D81B60",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    id: "rafael",
    nome: "Rafael Insônia",
    idade: 29,
    cidade: "Belo Horizonte",
    intencao: "Não sei ainda",
    quemSouEu: "Online 00h01. Quem se define se limita, mas eu limito a hora de dormir.",
    comunidades: ["00h01-e-a-insonia", "eu-nunca-terminei-uma-borracha", "orkut-raiz-instagram-pela-metade"],
    avaliacoes: { legal: 74, confiavel: 71, sexy: 55 },
    fotos: ["#CE93D8", "#5D4037", "#B39DDB"],
    avatarCor: "#7E57C2",
    acento: "#7E57C2",
    sexo: "homem",
    idadePublica: false,
    avatar: "https://picsum.photos/seed/rafael-feed/600/800",
  },
  {
    id: "camila",
    nome: "Camila Feijão",
    idade: 27,
    cidade: "Porto Alegre",
    intencao: "Relacionamento",
    quemSouEu: "Queria sorvete. Achei feijão. Ainda assim quero um recado fofo.",
    comunidades: ["queria-sorvete-mas-era-feijao", "quero-namorar-mas-tenho-preguica", "relacionamento-serio-recado-fofo"],
    avaliacoes: { legal: 83, confiavel: 80, sexy: 68 },
    fotos: ["#A5D6A7", "#FFCC80", "#F48FB1"],
    avatarCor: "#43A047",
    acento: "#43A047",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    id: "thiago",
    nome: "Thiago Pinguim",
    idade: 30,
    cidade: "São Paulo",
    intencao: "Só trabalho",
    quemSouEu: "Amigo de amigo de amigo. Playlist de 2008 e olhar o grid alheio.",
    comunidades: ["pinguim-tambem-ama", "amigos-de-amigos", "playlist-2008"],
    avaliacoes: { legal: 69, confiavel: 66, sexy: 58 },
    fotos: ["#90CAF9", "#ECEFF1", "#F48FB1"],
    avatarCor: "#1565C0",
    acento: "#1565C0",
    sexo: "homem",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/men/36.jpg",
  },
  {
    id: "bia",
    nome: "Bia Oliveira",
    idade: 24,
    cidade: "São Paulo",
    intencao: "Aberto a conhecer",
    quemSouEu: "Foto boa, recado curto e sem corrente.",
    comunidades: ["fotos-sem-flash-no-espelho", "pinguim-tambem-ama"],
    avaliacoes: { legal: 80, confiavel: 74, sexy: 88 },
    fotos: [],
    avatarCor: "#E91E63",
    acento: "#E91E63",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    id: "julia",
    nome: "Júlia Ferreira",
    idade: 27,
    cidade: "Belo Horizonte",
    intencao: "Relacionamento",
    quemSouEu: "Quero recado fofo e gente que aparece.",
    comunidades: ["relacionamento-serio-recado-fofo", "eu-amo-viajar-barato"],
    avaliacoes: { legal: 84, confiavel: 81, sexy: 79 },
    fotos: [],
    avatarCor: "#AD1457",
    acento: "#AD1457",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://picsum.photos/seed/julia-feed/600/800",
  },
  {
    id: "ana",
    nome: "Ana Beatriz",
    idade: 25,
    cidade: "Recife",
    intencao: "Só amizade",
    quemSouEu: "Amizade primeiro. Crush depois, se rolar.",
    comunidades: ["gente-que-responde-scrap", "eu-odeio-segunda-feira"],
    avaliacoes: { legal: 90, confiavel: 86, sexy: 70 },
    fotos: [],
    avatarCor: "#F06292",
    acento: "#F06292",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/women/47.jpg",
  },
  {
    id: "fernanda",
    nome: "Fernanda Lima",
    idade: 29,
    cidade: "Curitiba",
    intencao: "Casado",
    quemSouEu: "Casada e aqui só pela comunidade e pelos scraps.",
    comunidades: ["orkut-raiz-instagram-pela-metade", "playlist-2008"],
    avaliacoes: { legal: 88, confiavel: 92, sexy: 61 },
    fotos: [],
    avatarCor: "#C2185B",
    acento: "#C2185B",
    sexo: "mulher",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    id: "lucas",
    nome: "Lucas Pereira",
    idade: 28,
    cidade: "Goiânia",
    intencao: "Relacionamento",
    quemSouEu: "Mando crush secreto sem drama.",
    comunidades: ["quero-namorar-mas-tenho-preguica", "pinguim-tambem-ama"],
    avaliacoes: { legal: 76, confiavel: 73, sexy: 82 },
    fotos: [],
    avatarCor: "#1E88E5",
    acento: "#1E88E5",
    sexo: "homem",
    idadePublica: true,
    avatar: "https://picsum.photos/seed/lucas-feed/600/800",
  },
  {
    id: "pedro",
    nome: "Pedro Almeida",
    idade: 32,
    cidade: "Brasília",
    intencao: "Aberto a conhecer",
    quemSouEu: "Respondo recado e não desapareço.",
    comunidades: ["gente-que-responde-scrap", "eu-amo-viajar-barato"],
    avaliacoes: { legal: 81, confiavel: 85, sexy: 77 },
    fotos: [],
    avatarCor: "#3949AB",
    acento: "#3949AB",
    sexo: "homem",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: "gabriel",
    nome: "Gabriel Souza",
    idade: 26,
    cidade: "Salvador",
    intencao: "Só tô olhando, prometo",
    quemSouEu: "Olhando o grid. Talvez um scrap.",
    comunidades: ["so-to-olhando", "fotos-sem-flash-no-espelho"],
    avaliacoes: { legal: 72, confiavel: 68, sexy: 84 },
    fotos: [],
    avatarCor: "#00897B",
    acento: "#00897B",
    sexo: "homem",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/men/52.jpg",
  },
  {
    id: "henrique",
    nome: "Henrique Dias",
    idade: 30,
    cidade: "Fortaleza",
    intencao: "Só trabalho",
    quemSouEu: "Trabalho, comunidade e um café.",
    comunidades: ["eu-odeio-segunda-feira", "orkut-raiz-instagram-pela-metade"],
    avaliacoes: { legal: 79, confiavel: 80, sexy: 63 },
    fotos: [],
    avatarCor: "#6D4C41",
    acento: "#6D4C41",
    sexo: "homem",
    idadePublica: true,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  },
];

export const usuarioLogadoId = "marina";

export const posts: Post[] = [
  {
    id: "p1",
    tipo: "foto",
    autorId: "leticia",
    legenda: "Fim de tarde no Rio. Sem flash, sem corrente.",
    cor: "#F8BBD0",
    comunidades: ["fotos-sem-flash-no-espelho"],
    curtidas: 48,
    comentarios: 6,
    midia: "https://picsum.photos/seed/leticia-feed/600/800",
  },
  {
    id: "p2",
    tipo: "scrap",
    autorId: "joao",
    alvoId: "marina",
    texto: "Sua comunidade de viajar barato me pegou.",
  },
  {
    id: "p3",
    tipo: "foto",
    autorId: "camila",
    legenda: "Pote de sorvete. Spoiler: era feijão.",
    cor: "#A5D6A7",
    comunidades: ["queria-sorvete-mas-era-feijao"],
    curtidas: 31,
    comentarios: 11,
    midia: "https://picsum.photos/seed/camila-feed/600/800",
  },
  {
    id: "p4",
    tipo: "atividade",
    autorId: "marina",
    texto: "entrou em Eu odeio segunda-feira",
  },
  {
    id: "p5",
    tipo: "topico",
    autorId: "rafael",
    comunidadeSlug: "00h01-e-a-insonia",
    titulo: "Alguém acordado pra responder scrap agora?",
    respostas: 23,
  },
  {
    id: "p6",
    tipo: "foto",
    autorId: "marina",
    midia: "https://picsum.photos/seed/marina-feed/600/800",
    legenda: "São Paulo cinza, cachecol rosa, clima de recado.",
    cor: "#EC407A",
    comunidades: ["pinguim-tambem-ama"],
    curtidas: 72,
    comentarios: 9,
  },
  {
    id: "p7",
    tipo: "foto",
    autorId: "thiago",
    legenda: "Só tô olhando o grid. Prometo.",
    cor: "#89C4E1",
    comunidades: ["so-to-olhando"],
    curtidas: 14,
    comentarios: 2,
    midia: "https://picsum.photos/seed/thiago-feed/600/800",
  },
  {
    id: "p10",
    tipo: "foto",
    autorId: "bia",
    legenda: "Café da manhã e recado curto. Sem corrente.",
    cor: "#F8BBD0",
    comunidades: ["gente-que-responde-scrap"],
    curtidas: 61,
    comentarios: 8,
    midia: "https://picsum.photos/seed/bia-feed/600/800",
  },
  {
    id: "p11",
    tipo: "foto",
    autorId: "lucas",
    legenda: "Saiu o sol em Goiânia. Manda scrap se curtir viagem barata.",
    cor: "#89C4E1",
    comunidades: ["viajar-barato-dormir-cedo"],
    curtidas: 39,
    comentarios: 4,
    midia: "https://picsum.photos/seed/lucas-feed/600/800",
  },
  {
    id: "p12",
    tipo: "foto",
    autorId: "julia",
    legenda: "Look de sábado. Comunidade aleatória depois.",
    cor: "#F48FB1",
    comunidades: ["fotos-sem-flash-no-espelho"],
    curtidas: 88,
    comentarios: 12,
    midia: "https://picsum.photos/seed/julia-feed/600/800",
  },
  {
    id: "p13",
    tipo: "foto",
    autorId: "pedro",
    legenda: "Só trabalho hoje. Foto do almoço e paz.",
    cor: "#90CAF9",
    comunidades: ["pinguim-tambem-ama"],
    curtidas: 22,
    comentarios: 3,
    midia: "https://picsum.photos/seed/pedro-feed/600/800",
  },
  {
    id: "p14",
    tipo: "foto",
    autorId: "ana",
    legenda: "Fim de tarde no parque. Quem responde scrap ganha ponto.",
    cor: "#F8BBD0",
    comunidades: ["relacionamento-serio-recado-fofo"],
    curtidas: 54,
    comentarios: 7,
    midia: "https://picsum.photos/seed/ana-feed/600/800",
  },
  {
    id: "p15",
    tipo: "foto",
    autorId: "fernanda",
    legenda: "Playlist 2008 no fone e recado no mural.",
    cor: "#CE93D8",
    comunidades: ["playlist-2008"],
    curtidas: 41,
    comentarios: 5,
    midia: "https://picsum.photos/seed/fernanda-feed/600/800",
  },
  {
    id: "p16",
    tipo: "foto",
    autorId: "rafael",
    legenda: "00h01 e ainda acordado. Sem ghosting.",
    cor: "#B39DDB",
    comunidades: ["00h01-e-a-insonia"],
    curtidas: 27,
    comentarios: 9,
    midia: "https://picsum.photos/seed/rafael-feed/600/800",
  },
  {
    id: "p8",
    tipo: "atividade",
    autorId: "leticia",
    texto: "mandou um depoimento e já quer o topo",
  },
];

export const scraps: Scrap[] = [
  { id: "s1", de: "joao", para: "marina", texto: "Sua comunidade de viajar barato me pegou.", publico: true },
  { id: "s2", de: "leticia", para: "marina", texto: "O topo é meu? Brincadeira. Quase.", publico: true },
  { id: "s3", de: "camila", para: "marina", texto: "Manda o depoimento depois, hoje é scrap.", publico: true },
  { id: "s4", de: "lucas", para: "marina", texto: "Vi seu perfil. Manda um recado se quiser.", publico: true },
  { id: "s5", de: "bia", para: "marina", texto: "Seu grid tá bonito. Sem corrente, prometo.", publico: true },
  { id: "s6", de: "pedro", para: "marina", texto: "Oi. Respondo scrap no mesmo dia.", publico: true },
];

export const crushesIniciais = [
  { de: "lucas", para: "marina" },
  { de: "bia", para: "marina" },
  { de: "gabriel", para: "marina" },
];

export const depoimentos: Depoimento[] = [
  {
    id: "d1",
    de: "joao",
    para: "marina",
    texto: "Marina responde scrap e não faz corrente. Isso hoje em dia é depoimento de caráter.",
    status: "publicado",
    topo: true,
  },
  {
    id: "d2",
    de: "camila",
    para: "marina",
    texto: "A gente se achou numa comunidade besta e ficou. Recado fofo, intenção séria.",
    status: "publicado",
  },
  {
    id: "d3",
    de: "leticia",
    para: "marina",
    texto: "Não aceita. Queria só contar que seu grid tá bonito demais.",
    status: "pendente",
  },
  {
    id: "d4",
    de: "rafael",
    para: "marina",
    texto: "Se aceitar, eu disputo o topo de madrugada.",
    status: "publicado",
  },
];

export const topicos: Topico[] = [
  {
    id: "t1",
    comunidadeSlug: "eu-odeio-segunda-feira",
    autorId: "joao",
    titulo: "Segunda deveria ser feriado nacional de scrap",
    corpo: "Proposta séria: ninguém trabalha, todo mundo responde recado.",
    respostas: [
      { autorId: "marina", texto: "Assino embaixo. Com café." },
      { autorId: "rafael", texto: "Eu ainda estou na domingo 00h01." },
    ],
  },
  {
    id: "t2",
    comunidadeSlug: "eu-amo-viajar-barato",
    autorId: "leticia",
    titulo: "Hostel bom no Nordeste sem cair em corrente",
    corpo: "Me indica sem link suspeito, pelo amor.",
    respostas: [{ autorId: "camila", texto: "Evita o que promete café da manhã infinito." }],
  },
  {
    id: "t3",
    comunidadeSlug: "00h01-e-a-insonia",
    autorId: "rafael",
    titulo: "Alguém acordado pra responder scrap agora?",
    corpo: "Feed morto. Insônia viva.",
    respostas: [
      { autorId: "thiago", texto: "Só tô olhando." },
      { autorId: "marina", texto: "Deixa o recado que amanhã eu vejo. Mentira, já vi." },
    ],
  },
  {
    id: "t4",
    comunidadeSlug: "pinguim-tambem-ama",
    autorId: "thiago",
    titulo: "O mascote pode ter crush secreto?",
    corpo: "Pergunta oficial da comunidade.",
    respostas: [{ autorId: "leticia", texto: "Pode. Se for mútuo, Deu Pingu." }],
  },
];

export function getUsuario(id: string) {
  return usuarios.find((u) => u.id === id);
}

export function getComunidade(slug: string) {
  return comunidades.find((c) => c.slug === slug);
}

export function comuns(a: string[], b: string[]) {
  return a.filter((x) => b.includes(x));
}

export const logado = () => getUsuario(usuarioLogadoId)!;
