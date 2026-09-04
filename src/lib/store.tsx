"use client";

import { enviarMidia, getSupabase } from "@/lib/supabase";
import {
  comunidades as comunidadesBase,
  depoimentos as depoimentosBase,
  getUsuario as getUsuarioBase,
  posts as postsBase,
  scraps as scrapsBase,
  crushesIniciais,
  usuarioLogadoId,
  usuarios as usuariosBase,
  type Comunidade,
  type Depoimento,
  type Intencao,
  type Post,
  type Scrap,
  type Usuario,
} from "@/data/mock";
import { checarPublicacao } from "@/lib/moderacao";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Crush = { de: string; para: string };
export type Mensagem = { id: string; de: string; para: string; texto: string };
export type Conta = { email: string; senha: string; userId: string; chave?: string };
export type Voto = { de: string; para: string; tipo: "legal" | "confiavel" | "sexy" };
export type Reacao = { alvo: string; de: string; tipo: "like" | "dislike" };
export type Comentario = {
  id: string;
  postId: string;
  autorId: string;
  texto: string;
  status: "pendente" | "publicado";
};
export type Story = {
  id: string;
  autorId: string;
  midia: string;
  video: boolean;
  criadoEm: number;
};

export type PostComunidade = {
  id: string;
  comunidadeSlug: string;
  autorId: string;
  texto: string;
  midia?: string;
  video?: boolean;
  status: "pendente" | "publicado";
};

export type Campanha = {
  id: string;
  donoId: string;
  nome: string;
  objetivo: "Reconhecimento" | "Tráfego" | "Engajamento" | "Leads" | "App" | "Vendas";
  publico: string;
  local: string;
  idade: string;
  idadeMin?: string;
  idadeMax?: string;
  alvoCidade?: string;
  alvoUf?: string;
  titulo?: string;
  texto: string;
  url: string;
  orcamento: number;
  tipoOrcamento: "diario" | "total";
  inicio: string;
  fim: string;
  midia?: string;
  video?: boolean;
  status: "rascunho" | "analise" | "aprovado" | "reprovado" | "pausado";
  motivo?: string;
  conversoes: number;
  gasto: number;
};

type Estado = {
  euId: string;
  usuariosExtra: Usuario[];
  scraps: Scrap[];
  depoimentos: Depoimento[];
  posts: Post[];
  crushes: Crush[];
  mensagens: Mensagem[];
  contas: Conta[];
  comunidadesExtra: Comunidade[];
  votos: Voto[];
  reacoes: Reacao[];
  comentarios: Comentario[];
  postsComunidade: PostComunidade[];
  stories: Story[];
  pedidos: { slug: string; userId: string }[];
  comunidadesRemovidas: string[];
  anuncios: { id: string; quem: string; valor: number; mes: string }[];
  banidos: string[];
  denuncias: { id: string; de: string; para: string; motivo: string; em: number; valida: boolean }[];
  punicoes: { userId: string; tipo: "ban7" | "excluido"; em: number; ate?: number }[];
  campanhas: Campanha[];
  saldoAds: number;
  lastSeen: Record<string, number>;
};

const KEY = "pinguork-estado-v3";
export const ADMIN_EMAIL = "adspenguin.agencia@gmail.com";
export const ADMIN_SENHA = "Ana1234567";
export const ADMIN_ID = "dono-pinguork";

const inicial: Estado = {
  euId: "",
  scraps: scrapsBase,
  depoimentos: depoimentosBase,
  posts: postsBase,
  crushes: crushesIniciais,
  mensagens: [],
  contas: [{ email: ADMIN_EMAIL, senha: ADMIN_SENHA, userId: ADMIN_ID }],
  comunidadesExtra: [],
  votos: [],
  reacoes: [],
  comentarios: [],
  postsComunidade: [],
  stories: [
    { id: "st-bia", autorId: "bia", midia: "https://picsum.photos/seed/bia-story/600/900", video: false, criadoEm: Date.now() - 2 * 60 * 60 * 1000 },
    { id: "st-bia2", autorId: "bia", midia: "https://picsum.photos/seed/bia-story2/600/900", video: false, criadoEm: Date.now() - 60 * 60 * 1000 },
    { id: "st-lucas", autorId: "lucas", midia: "https://picsum.photos/seed/lucas-story/600/900", video: false, criadoEm: Date.now() - 3 * 60 * 60 * 1000 },
    { id: "st-julia", autorId: "julia", midia: "https://picsum.photos/seed/julia-story/600/900", video: false, criadoEm: Date.now() - 30 * 60 * 1000 },
    { id: "st-pedro", autorId: "pedro", midia: "https://picsum.photos/seed/pedro-story/600/900", video: false, criadoEm: Date.now() - 5 * 60 * 60 * 1000 },
    { id: "st-ana", autorId: "ana", midia: "https://picsum.photos/seed/ana-story/600/900", video: false, criadoEm: Date.now() - 90 * 60 * 1000 },
    { id: "st-leticia", autorId: "leticia", midia: "https://randomuser.me/api/portraits/women/68.jpg", video: false, criadoEm: Date.now() - 40 * 60 * 1000 },
    { id: "st-camila", autorId: "camila", midia: "https://randomuser.me/api/portraits/women/21.jpg", video: false, criadoEm: Date.now() - 70 * 60 * 1000 },
    { id: "st-thiago", autorId: "thiago", midia: "https://randomuser.me/api/portraits/men/32.jpg", video: false, criadoEm: Date.now() - 15 * 60 * 1000 },
    { id: "st-fernanda", autorId: "fernanda", midia: "https://randomuser.me/api/portraits/women/65.jpg", video: false, criadoEm: Date.now() - 110 * 60 * 1000 },
    { id: "st-rafael", autorId: "rafael", midia: "https://randomuser.me/api/portraits/men/22.jpg", video: false, criadoEm: Date.now() - 200 * 60 * 1000 },
  ],
  pedidos: [],
  comunidadesRemovidas: [],
  denuncias: [],
  punicoes: [],
  campanhas: [],
  saldoAds: 0,
  lastSeen: {},
  banidos: [],
  anuncios: [
    { id: "a1", quem: "Café da Esquina", valor: 180, mes: "2026-09" },
    { id: "a2", quem: "Hostel Barato", valor: 320, mes: "2026-09" },
    { id: "a3", quem: "Playlist 2008 Store", valor: 90, mes: "2026-09" },
    { id: "a4", quem: "Sorvete que era feijão", valor: 45, mes: "2026-08" },
  ],
  usuariosExtra: [
    {
      id: ADMIN_ID,
      nome: "Dono Deu Pingu",
      idade: 30,
      cidade: "São Paulo",
      intencao: "Só trabalho",
      quemSouEu: "Painel da rede.",
      comunidades: [],
      avaliacoes: { legal: 100, confiavel: 100, sexy: 0 },
      fotos: [],
      avatarCor: "#AD1457",
      acento: "#AD1457",
      sexo: "outro",
      idadePublica: false,
    },
  ],
};

const Ctx = createContext<{
  pronto: boolean;
  estado: Estado;
  eu: Usuario;
  usuarios: Usuario[];
  comunidades: Comunidade[];
  getUsuario: (id: string) => Usuario | undefined;
  entrar: (dados: {
    nome: string;
    cidade: string;
    intencao: Intencao;
    email?: string;
    senha?: string;
    idade?: number;
    sexo?: Usuario["sexo"];
    idadePublica?: boolean;
    uf?: string;
  }) => Promise<string> | string;
  login: (email: string, senha: string) => Promise<string> | string;
  sair: () => void;
  mandarScrap: (para: string, texto: string) => string;
  publicarFeed: (texto: string, midia?: string, video?: boolean, arquivoNome?: string) => Promise<string> | string;
  mandarDepoimento: (para: string, texto: string) => void;
  aceitarDepoimento: (id: string, aceitar: boolean) => void;
  crush: (para: string) => "enviado" | "match" | "voce";
  recusarCrush: (de: string) => void;
  temCrush: (de: string, para: string) => boolean;
  ehMatch: (a: string, b: string) => boolean;
  mensagensCom: (id: string) => Mensagem[];
  mandarMsg: (para: string, texto: string) => void;
  setFoto: (dataUrl: string, arquivoNome?: string) => Promise<string> | string;
  editarPerfil: (dados: Partial<Usuario>) => void;
  votar: (para: string, tipo: Voto["tipo"]) => void;
  jaVotou: (para: string, tipo: Voto["tipo"]) => boolean;
  toggleComunidade: (slug: string) => "entrou" | "saiu" | "pedido";
  criarComunidade: (nome: string, descricao?: string, capa?: string, tipo?: Comunidade["tipo"]) => void;
  aprovarEntrada: (slug: string, userId: string, aceitar: boolean) => void;
  removerMembro: (slug: string, userId: string) => void;
  excluirComunidade: (slug: string) => void;
  editarComunidade: (slug: string, dados: Partial<Comunidade>) => void;
  pedidoPendente: (slug: string) => boolean;
  apagarConta: () => void;
  redefinirSenha: (email: string, nova: string) => string;
  garantirChave: () => string;
  pedirReset: (email: string) => { ok: string; link?: string } | { erro: string };
  resetComToken: (token: string, nova: string) => string;
  ehAdmin: boolean;
  banirUsuario: (id: string) => void;
  denunciarConta: (id: string, motivo: string) => string;
  statusConta: (id: string) => "ok" | "ban7" | "excluido";
  checar: (texto: string, arquivoNome?: string) => string | null;
  membrosDa: (slug: string) => Usuario[];
  recomendados: Usuario[];
  publicarComunidade: (slug: string, texto: string, midia?: string, video?: boolean) => void;
  moderarPost: (id: string, aceitar: boolean) => void;
  moderarComentario: (id: string, aceitar: boolean) => void;
  comentar: (postId: string, texto: string, comunidadeSlug?: string) => void;
  reagir: (alvo: string, tipo: "like" | "dislike") => void;
  contaReacao: (alvo: string, tipo: "like" | "dislike") => number;
  ehDono: (slug: string) => boolean;
  addStory: (midia: string, video: boolean) => void;
  apagarStory: (id: string) => void;
  storiesAtivas: Story[];
  toggleSeguir: (id: string) => void;
  segue: (id: string) => boolean;
  feedOrdenado: Post[];
  editarPost: (id: string, legenda: string) => string;
  apagarPost: (id: string) => void;
  apagarComentario: (id: string) => void;
  criarCampanha: (dados: Omit<Campanha, "id" | "donoId" | "status" | "conversoes" | "gasto" | "motivo">) => string;
  pausarCampanha: (id: string) => void;
} | null>(null);

function slugify(s: string) {
  return (
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "eu"
  );
}

function upsertUser(lista: Usuario[], u: Usuario) {
  return [...lista.filter((x) => x.id !== u.id), u];
}

export function PinguProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<Estado>(inicial);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) || localStorage.getItem("pinguork-estado-v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        setEstado({
          ...inicial,
          ...parsed,
          reacoes: parsed.reacoes || [],
          comentarios: parsed.comentarios || [],
          postsComunidade: parsed.postsComunidade || [],
          stories: (() => {
            const atuais = parsed.stories && parsed.stories.length ? parsed.stories : [];
            const ids = new Set(atuais.map((s: Story) => s.id));
            return [...inicial.stories.filter((s) => !ids.has(s.id)), ...atuais];
          })(),
          pedidos: parsed.pedidos || [],
          comunidadesRemovidas: parsed.comunidadesRemovidas || [],
          anuncios: parsed.anuncios || inicial.anuncios,
          banidos: parsed.banidos || [],
          denuncias: parsed.denuncias || [],
          punicoes: parsed.punicoes || [],
          campanhas: parsed.campanhas || [],
          saldoAds: parsed.saldoAds || 0,
          lastSeen: parsed.lastSeen || {},
          contas: [
            { email: ADMIN_EMAIL, senha: ADMIN_SENHA, userId: ADMIN_ID },
            ...(parsed.contas || []).filter((c: Conta) => c.email !== ADMIN_EMAIL),
          ],
          euId: (parsed.contas || []).some((c: Conta) => c.userId === parsed.euId) || parsed.euId === ADMIN_ID ? parsed.euId : "",
          posts: (() => {
            const salvos: Post[] = parsed.posts || [];
            const ids = new Set(salvos.map((p) => p.id));
            const mesclados = salvos.map((p) => {
              const base = postsBase.find((b) => b.id === p.id);
              if (base?.midia && !p.midia) return { ...p, midia: base.midia, tipo: "foto" as const };
              return p;
            });
            return [...postsBase.filter((b) => !ids.has(b.id)), ...mesclados];
          })(),
        });
      }
    } catch {
      /* ignore */
    }
    setPronto(true);
  }, []);

  useEffect(() => {
    if (!pronto) return;
    const sb = getSupabase();
    if (!sb) return;
    void sb.from("contas_cpf").select("*").then(({ data: rows }) => {
      if (!rows) return;
      setEstado((s) => {
        let extra = s.usuariosExtra;
        const contas = [...s.contas];
        for (const row of rows) {
          if (!row.user_id) continue;
          const old = extra.find((u) => u.id === row.user_id);
          extra = upsertUser(extra, {
            id: row.user_id,
            nome: row.nome || old?.nome || "Pinguim",
            idade: row.idade || old?.idade || 25,
            cidade: row.cidade || old?.cidade || "",
            uf: row.uf || old?.uf || "",
            intencao: row.intencao || old?.intencao || "Aberto a conhecer",
            quemSouEu: row.frase || old?.quemSouEu || "Conta Deu Pingu.",
            comunidades: old?.comunidades || [],
            avaliacoes: old?.avaliacoes || { legal: 50, confiavel: 50, sexy: 50 },
            fotos: (old?.avatar || "").startsWith("data:") ? old?.fotos || [] : row.foto ? [row.foto] : old?.fotos || [],
            avatar: (old?.avatar || "").startsWith("data:") ? old?.avatar : row.foto || old?.avatar,
            avatarCor: old?.avatarCor || "#EC407A",
            acento: old?.acento || "#EC407A",
            sexo: row.sexo || old?.sexo,
            apelido: row.apelido || old?.apelido,
            idadePublica: old?.idadePublica,
            seguindo: old?.seguindo,
          });
          if (row.cpf && !contas.some((c) => c.email === row.cpf)) {
            contas.push({ email: row.cpf, senha: row.senha || "", userId: row.user_id, chave: row.chave });
          } else {
            contas.forEach((c, i) => {
              if (c.email === row.cpf && row.chave) contas[i] = { ...c, chave: row.chave };
            });
          }
        }
        return { ...s, usuariosExtra: extra, contas };
      });
    });
    void sb.from("profiles").select("*").then(({ data: perfis }) => {
      if (!perfis) return;
      setEstado((s) => {
        let extra = s.usuariosExtra;
        for (const perfil of perfis) {
          extra = upsertUser(extra, {
            id: perfil.id,
            nome: perfil.nome || "Pinguim",
            idade: perfil.idade || 25,
            cidade: perfil.cidade || "",
            uf: perfil.uf || "",
            intencao: perfil.intencao || "Aberto a conhecer",
            quemSouEu: "Conta Deu Pingu.",
            comunidades: [],
            avaliacoes: { legal: 50, confiavel: 50, sexy: 50 },
            fotos: perfil.foto ? [perfil.foto] : [],
            avatar: perfil.foto || undefined,
            avatarCor: "#EC407A",
            acento: "#EC407A",
          });
        }
        return { ...s, usuariosExtra: extra };
      });
    });
    void sb.from("stories").select("*").then(({ data }) => {
      if (!data) return;
      setEstado((s) => {
        const ids = new Set(s.stories.map((x) => x.id));
        const novos = data.filter((r) => !ids.has(r.id)).map((r) => ({
          id: r.id, autorId: r.autor_id, midia: r.midia || "", video: !!r.video, criadoEm: Number(r.criado_em) || Date.now(),
        }));
        return novos.length ? { ...s, stories: [...novos, ...s.stories] } : s;
      });
    });
    void sb.from("comunidades_app").select("*").then(({ data }) => {
      if (!data) return;
      setEstado((s) => {
        const slugs = new Set(s.comunidadesExtra.map((c) => c.slug));
        const extra = data.filter((r) => !slugs.has(r.slug)).map((r) => ({
          slug: r.slug, nome: r.nome || r.slug, membros: "1", descricao: r.descricao || "", cor: "#EC407A",
          donoId: r.dono_id, capa: r.capa || undefined, tipo: r.tipo || "aberta", restrita: r.tipo === "fechada",
        }));
        return extra.length ? { ...s, comunidadesExtra: [...s.comunidadesExtra, ...extra] } : s;
      });
    });
    void sb.from("recados").select("*").then(({ data }) => {
      if (!data) return;
      setEstado((s) => {
        const ids = new Set(s.mensagens.map((m) => m.id));
        const extra = data.filter((r) => !ids.has(r.id)).map((r) => ({ id: r.id, de: r.de, para: r.para, texto: r.texto }));
        return extra.length ? { ...s, mensagens: [...s.mensagens, ...extra] } : s;
      });
    });
    void sb.from("crushes").select("*").then(({ data }) => {
      if (!data) return;
      setEstado((s) => {
        const tem = (de: string, para: string) => s.crushes.some((c) => c.de === de && c.para === para);
        const extra = data.filter((r) => !tem(r.de, r.para)).map((r) => ({ de: r.de, para: r.para }));
        return extra.length ? { ...s, crushes: [...s.crushes, ...extra] } : s;
      });
    });
    void sb.from("posts").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      if (!data) return;
      setEstado((s) => {
        const ids = new Set(s.posts.map((p) => p.id));
        const extras: Post[] = data
          .filter((row) => !ids.has(row.id))
          .map((row) => ({
            id: row.id,
            tipo: "foto" as const,
            autorId: row.autor_id,
            legenda: row.legenda || "",
            cor: row.video ? "#3E2723" : "#F48FB1",
            comunidades: [],
            curtidas: 0,
            comentarios: 0,
            midia: row.midia || undefined,
            video: !!row.video,
          }));
        return extras.length ? { ...s, posts: [...extras, ...s.posts] } : s;
      });
    });
  }, [pronto]);

  useEffect(() => {
    if (!pronto) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(estado));
    } catch {
      alert("Memória do navegador cheia. Tira um vídeo grande e tenta de novo.");
    }
  }, [estado, pronto]);

  const usuarios = useMemo(
    () =>
      [...usuariosBase.filter((u) => !estado.usuariosExtra.some((x) => x.id === u.id)), ...estado.usuariosExtra].filter(
        (u) => !estado.banidos.includes(u.id) && u.id !== ADMIN_ID
      ),
    [estado.usuariosExtra, estado.banidos]
  );

  const comunidades = useMemo(
    () =>
      [...comunidadesBase, ...estado.comunidadesExtra].filter(
        (c, i, arr) => arr.findIndex((x) => x.slug === c.slug) === i && !estado.comunidadesRemovidas.includes(c.slug)
      ),
    [estado.comunidadesExtra, estado.comunidadesRemovidas]
  );

  const getUsuario = (id: string) =>
    estado.usuariosExtra.find((u) => u.id === id) || usuarios.find((u) => u.id === id) || getUsuarioBase(id);
  const eu = getUsuario(estado.euId) || usuariosBase[0];

  function patchEu(s: Estado, fn: (u: Usuario) => Usuario): Estado {
    const atual =
      s.usuariosExtra.find((u) => u.id === s.euId) ||
      usuariosBase.find((u) => u.id === s.euId) || {
        id: s.euId,
        nome: "Eu",
        idade: 25,
        cidade: "",
        intencao: "Aberto a conhecer" as const,
        quemSouEu: "",
        comunidades: [],
        avaliacoes: { legal: 50, confiavel: 50, sexy: 50 },
        fotos: [],
        avatarCor: "#EC407A",
        acento: "#EC407A",
      };
    return { ...s, usuariosExtra: upsertUser(s.usuariosExtra, fn({ ...atual })) };
  }

  async function entrar(dados: {
    nome: string;
    cidade: string;
    uf?: string;
    intencao: Intencao;
    email?: string;
    senha?: string;
    idade?: number;
    sexo?: Usuario["sexo"];
    idadePublica?: boolean;
    apelido?: string;
  }) {
    const id = slugify(dados.nome);
    const bruto = (dados.email || "").trim().toLowerCase();
    const cpf = bruto.replace(/\D/g, "");
    const email = bruto.includes("@") ? bruto : cpf;
    if (email && !email.includes("@") && (cpf.length < 10 || cpf.length > 13)) return "WhatsApp com DDD. Ex: 11999999999";
    if (email && estado.contas.some((c) => c.email === email)) return "Esse WhatsApp já tem conta. Usa Entrar.";
    const apelido = (dados.apelido || "").trim().toLowerCase().replace(/^@/, "").replace(/[^a-z0-9._]/g, "");
    if (!apelido || apelido.length < 3) return "Apelido no estilo @seu_nome (mínimo 3 caracteres).";
    const ocupado = usuarios.some((u) => (u.apelido || "").toLowerCase() === apelido) || estado.usuariosExtra.some((u) => (u.apelido || "").toLowerCase() === apelido);
    if (ocupado) return "Nome de usuário em uso.";
    const novo: Usuario = {
      id,
      nome: dados.nome.trim() || "Pinguim sem nome",
      idade: dados.idade && dados.idade > 17 ? dados.idade : 25,
      cidade: dados.cidade.trim(),
      uf: dados.uf || "",
      intencao: dados.intencao,
      quemSouEu: "Acabei de entrar no Deu Pingu. Manda um scrap.",
      comunidades: [],
      seguindo: [],
      avaliacoes: { legal: 50, confiavel: 50, sexy: 50 },
      fotos: ["#EC407A", "#F48FB1", "#89C4E1"],
      avatarCor: "#EC407A",
      acento: "#EC407A",
      sexo: dados.sexo,
      idadePublica: dados.idadePublica !== false,
      apelido,
    };
    const chaveRecuperacao = Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
    const sb = getSupabase();
    if (sb && email && dados.senha && email.includes("@")) {
      const { data, error } = await sb.auth.signUp({ email, password: dados.senha });
      if (error) return error.message;
      if (data.user) {
        await sb.from("profiles").upsert({
          id: data.user.id,
          nome: novo.nome,
          cidade: novo.cidade,
          uf: novo.uf || "",
          idade: novo.idade,
          sexo: novo.sexo || "outro",
          intencao: novo.intencao,
          last_seen: new Date().toISOString(),
        });
        novo.id = data.user.id;
      }
    }
    setEstado((s) => ({
      ...s,
      euId: novo.id,
      usuariosExtra: upsertUser(s.usuariosExtra, novo),
      contas: email
        ? [...s.contas.filter((c) => c.email !== email), { email, senha: dados.senha || "", userId: novo.id, chave: chaveRecuperacao }]
        : s.contas,
    }));
    if (sb && email && !email.includes("@") && dados.senha) {
      try {
        await sb.from("contas_cpf").upsert({ cpf: email, senha: dados.senha, nome: novo.nome, cidade: novo.cidade, uf: novo.uf || "", user_id: novo.id, chave: chaveRecuperacao });
      } catch {}
    }
    if (typeof window !== "undefined") window.alert("ANOTA ESTE CÓDIGO\n\n" + chaveRecuperacao + "\n\nEste é o ÚNICO jeito de recuperar a senha se você esquecer. Sem esse código não tem como.");
    return "ok::" + chaveRecuperacao;
  }

  function statusConta(id: string): "ok" | "ban7" | "excluido" {
    const pun = [...estado.punicoes].reverse().find((p) => p.userId === id);
    if (!pun) return estado.banidos.includes(id) ? "excluido" : "ok";
    if (pun.tipo === "excluido") return "excluido";
    if (pun.tipo === "ban7" && pun.ate && Date.now() < pun.ate) return "ban7";
    return "ok";
  }

  async function login(email: string, senha: string) {
    const bruto = email.trim().toLowerCase();
    const chave = bruto.includes("@") ? bruto : bruto.replace(/\D/g, "");
    const local = estado.contas.find((x) => x.email === chave && x.senha === senha);
    if (local) {
      const sbLocal = getSupabase();
      if (sbLocal && !chave.includes("@")) {
        const { data: row } = await sbLocal.from("contas_cpf").select("*").eq("cpf", chave).maybeSingle();
        if (row) {
          setEstado((s) => ({
            ...s,
            euId: row.user_id || local.userId,
            contas: s.contas.map((c) => (c.email === chave ? { ...c, userId: row.user_id || c.userId, chave: row.chave || c.chave } : c)),
            usuariosExtra: upsertUser(s.usuariosExtra, {
              ...(s.usuariosExtra.find((u) => u.id === (row.user_id || local.userId)) || {
                id: row.user_id || local.userId,
                nome: row.nome || "Pinguim",
                idade: row.idade || 25,
                cidade: row.cidade || "",
                uf: row.uf || "",
                intencao: (row.intencao as Intencao) || "Aberto a conhecer",
                quemSouEu: row.frase || "",
                comunidades: [],
                avaliacoes: { legal: 50, confiavel: 50, sexy: 50 },
                fotos: [],
                avatarCor: "#EC407A",
                acento: "#EC407A",
              }),
              id: row.user_id || local.userId,
              nome: row.nome || "Pinguim",
              idade: row.idade || 25,
              cidade: row.cidade || "",
              avatar: row.foto || undefined,
              fotos: row.foto ? [row.foto] : [],
            }),
          }));
          return "ok";
        }
      }
      setEstado((s) => ({ ...s, euId: local.userId }));
      return "ok";
    }
    const sb = getSupabase();
    if (sb && !chave.includes("@")) {
      const { data: row } = await sb.from("contas_cpf").select("*").eq("cpf", chave).maybeSingle();
      if (row && row.senha === senha) {
        setEstado((s) => ({
          ...s,
          euId: row.user_id,
          contas: [...s.contas.filter((x) => x.email !== chave), { email: chave, senha, userId: row.user_id }],
        }));
        return "ok";
      }
      if (row) return "Número ou senha errado.";
    }
    if (sb && chave.includes("@")) {
      const { data, error } = await sb.auth.signInWithPassword({ email: chave, password: senha });
      if (error) {
        const e = email.trim().toLowerCase();
        if (e === ADMIN_EMAIL && senha === ADMIN_SENHA) {
          setEstado((s) => ({ ...s, euId: ADMIN_ID }));
          return "ok";
        }
        const local = estado.contas.find((x) => x.email === e && x.senha === senha);
        if (local) {
          setEstado((s) => ({ ...s, euId: local.userId }));
          return "ok";
        }
        return "Número ou senha errado.";
      }
      const uid = data.user?.id;
      if (uid) {
        const { data: perfil } = await sb.from("profiles").select("*").eq("id", uid).maybeSingle();
        await sb.from("profiles").upsert({ id: uid, last_seen: new Date().toISOString() });
        setEstado((s) => ({
          ...s,
          euId: uid,
          contas: [...s.contas.filter((x) => x.email !== email.trim().toLowerCase()), { email: email.trim().toLowerCase(), senha, userId: uid }],
          usuariosExtra: perfil
            ? upsertUser(s.usuariosExtra, {
                id: uid,
                nome: perfil.nome || email,
                idade: perfil.idade || 25,
                cidade: perfil.cidade || "",
                uf: perfil.uf || "",
                intencao: (perfil.intencao as any) || "Aberto a conhecer",
                quemSouEu: "Conta Deu Pingu.",
                comunidades: [],
                avaliacoes: { legal: 50, confiavel: 50, sexy: 50 },
                fotos: [],
                avatarCor: "#EC407A",
                acento: "#EC407A",
                sexo: perfil.sexo,
              })
            : s.usuariosExtra,
        }));
        return "ok";
      }
    }
    const c = estado.contas.find((x) => x.email === email.trim().toLowerCase() && x.senha === senha);
    if (!c) return "Número ou senha errado.";
    const st = statusConta(c.userId);
    if (st === "excluido") return "Esta conta foi excluída permanentemente.";
    if (st === "ban7") return "Conta bloqueada por 7 dias por denúncias.";
    setEstado((s) => ({ ...s, euId: c.userId }));
    return "ok";
  }

  function sair() {
    const sb = getSupabase();
    if (sb) void sb.auth.signOut();
    setEstado((s) => ({ ...s, euId: "" }));
  }

  function checar(texto: string, arquivoNome?: string) {
    return checarPublicacao(texto, arquivoNome);
  }

  function mandarScrap(para: string, texto: string) {
    const erro = checarPublicacao(texto);
    if (erro) return erro;
    const scrap: Scrap = { id: "s" + Date.now(), de: estado.euId, para, texto, publico: true };
    setEstado((s) => ({ ...s, scraps: [scrap, ...s.scraps] }));
    return "ok";
  }

  async function publicarFeed(texto: string, midia?: string, video?: boolean, arquivoNome?: string) {
    const erro = checarPublicacao(texto, arquivoNome);
    if (erro) return erro;
    const id = "p" + Date.now();
    let url = midia;
    if (midia && midia.startsWith("data:")) {
      url = await enviarMidia(midia, `${estado.euId}/${id}`);
    }
    const post: Post = {
      id,
      tipo: "foto",
      autorId: estado.euId,
      legenda: texto,
      cor: video ? "#3E2723" : "#F48FB1",
      comunidades: eu.comunidades.slice(0, 1),
      curtidas: 0,
      comentarios: 0,
      midia: url,
      video,
    };
    const sb = getSupabase();
    if (sb) {
      await sb.from("posts").insert({
        id,
        autor_id: estado.euId,
        legenda: texto,
        midia: url || null,
        video: !!video,
      });
    }
    setEstado((s) => ({ ...s, posts: [post, ...s.posts] }));
    return "ok";
  }

  function mandarDepoimento(para: string, texto: string) {
    setEstado((s) => ({
      ...s,
      depoimentos: [{ id: "d" + Date.now(), de: s.euId, para, texto, status: "pendente" }, ...s.depoimentos],
    }));
  }

  function aceitarDepoimento(id: string, aceitar: boolean) {
    setEstado((s) => ({
      ...s,
      depoimentos: aceitar
        ? s.depoimentos.map((d) => (d.id === id ? { ...d, status: "publicado" as const } : d))
        : s.depoimentos.filter((d) => d.id !== id),
    }));
  }

  function temCrush(de: string, para: string) {
    return estado.crushes.some((c) => c.de === de && c.para === para);
  }
  function ehMatch(a: string, b: string) {
    return temCrush(a, b) && temCrush(b, a);
  }
  function crush(para: string): "enviado" | "match" | "voce" {
    if (para === estado.euId) return "voce";
    if (temCrush(estado.euId, para) && ehMatch(estado.euId, para)) return "match";
    if (temCrush(estado.euId, para)) return "enviado";
    const jaRecebeu = temCrush(para, estado.euId);
    setEstado((s) => ({ ...s, crushes: [...s.crushes, { de: s.euId, para }] }));
    const sb = getSupabase();
    if (sb) void sb.from("crushes").upsert({ de: estado.euId, para });
    return jaRecebeu ? "match" : "enviado";
  }

  function recusarCrush(de: string) {
    setEstado((s) => ({ ...s, crushes: s.crushes.filter((c) => !(c.de === de && c.para === s.euId)) }));
  }

  function mensagensCom(id: string) {
    return estado.mensagens.filter(
      (m) => (m.de === estado.euId && m.para === id) || (m.de === id && m.para === estado.euId)
    );
  }
  function mandarMsg(para: string, texto: string) {
    const erro = checarPublicacao(texto);
    if (erro) return erro;
    const msg: Mensagem = { id: "m" + Date.now(), de: estado.euId, para, texto };
    const auto = usuariosBase.some((u) => u.id === para)
      ? [{ id: "m" + (Date.now() + 1), de: para, para: estado.euId, texto: "Deu Pingu! Vi seu recado." }]
      : [];
    setEstado((s) => ({ ...s, mensagens: [...s.mensagens, msg, ...auto] }));
    const sb = getSupabase();
    if (sb) void sb.from("recados").insert({ id: msg.id, de: msg.de, para: msg.para, texto: msg.texto });
  }

  async function setFoto(dataUrl: string, arquivoNome?: string) {
    const erro = checarPublicacao("", arquivoNome);
    if (erro) return erro;
    let url = dataUrl;
    setEstado((s) => patchEu(s, (u) => ({ ...u, avatar: dataUrl, fotos: [dataUrl, ...u.fotos.slice(0, 5)] })));
    const sb = getSupabase();
    const conta = estado.contas.find((c) => c.userId === estado.euId);
    {
      const res = await fetch("/api/salvar-perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: (conta && !String(conta.email).includes("@") ? conta.email : estado.euId),
          senha: conta?.senha || "-",
          userId: estado.euId,
          foto: url,
          nome: eu.nome,
          cidade: eu.cidade,
          uf: eu.uf,
          idade: eu.idade,
          sexo: eu.sexo,
          intencao: eu.intencao,
          frase: eu.quemSouEu,
          apelido: eu.apelido,
          chave: conta.chave,
        }),
      });
      const j = await res.json();
      if (!j.ok) return "Não salvou a foto: " + (j.error || "erro");
      if (j.foto) url = j.foto;
    }
    setEstado((s) => patchEu(s, (u) => ({ ...u, avatar: url, fotos: [url, ...u.fotos.slice(0, 5)] })));
    return "ok";
  }

  async function editarPerfil(dados: Partial<Usuario>) {
    setEstado((s) => patchEu(s, (u) => ({ ...u, ...dados })));
    const conta = estado.contas.find((c) => c.userId === estado.euId);
    if (conta && !String(conta.email).includes("@")) {
      const euAgora = { ...eu, ...dados };
      await fetch("/api/salvar-perfil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cpf: conta.email,
          senha: conta.senha,
          userId: estado.euId,
          foto: euAgora.avatar,
          nome: euAgora.nome,
          cidade: euAgora.cidade,
          uf: euAgora.uf,
          idade: euAgora.idade,
          sexo: euAgora.sexo,
          intencao: euAgora.intencao,
          frase: euAgora.quemSouEu,
          apelido: euAgora.apelido,
          chave: conta.chave,
        }),
      });
    }
    const sb = getSupabase();
    if (sb) {
      void sb.from("profiles").upsert({
        id: estado.euId,
        nome: dados.nome,
        cidade: dados.cidade,
        uf: dados.uf,
        idade: dados.idade,
        sexo: dados.sexo,
        intencao: dados.intencao,
      });
      const conta = estado.contas.find((c) => c.userId === estado.euId);
      if (conta && !conta.email.includes("@")) {
        void sb.from("contas_cpf").update({
          nome: dados.nome,
          cidade: dados.cidade,
          uf: dados.uf,
          idade: dados.idade,
          sexo: dados.sexo,
          intencao: dados.intencao,
          frase: dados.quemSouEu,
          apelido: dados.apelido,
        }).eq("cpf", conta.email);
      }
    }
  }

  function jaVotou(para: string, tipo: Voto["tipo"]) {
    return estado.votos.some((v) => v.de === estado.euId && v.para === para && v.tipo === tipo);
  }

  function votar(para: string, tipo: Voto["tipo"]) {
    if (para === estado.euId || jaVotou(para, tipo)) return;
    setEstado((s) => {
      const alvo = s.usuariosExtra.find((u) => u.id === para) || usuariosBase.find((u) => u.id === para);
      if (!alvo) return s;
      const av = { ...alvo.avaliacoes, [tipo]: Math.min(100, alvo.avaliacoes[tipo] + 8) };
      return {
        ...s,
        votos: [...s.votos, { de: s.euId, para, tipo }],
        usuariosExtra: upsertUser(s.usuariosExtra, { ...alvo, avaliacoes: av }),
      };
    });
  }

  function toggleComunidade(slug: string): "entrou" | "saiu" | "pedido" {
    const c = comunidades.find((x) => x.slug === slug);
    const ja = eu.comunidades.includes(slug);
    if (ja) {
      setEstado((s) => patchEu(s, (u) => ({ ...u, comunidades: u.comunidades.filter((x) => x !== slug) })));
      return "saiu";
    }
    if ((c?.restrita || c?.tipo === "fechada") && c.donoId !== estado.euId) {
      setEstado((s) => ({
        ...s,
        pedidos: s.pedidos.some((p) => p.slug === slug && p.userId === s.euId)
          ? s.pedidos
          : [...s.pedidos, { slug, userId: s.euId }],
      }));
      return "pedido";
    }
    setEstado((s) => patchEu(s, (u) => ({ ...u, comunidades: [...u.comunidades, slug] })));
    return "entrou";
  }

  function pedidoPendente(slug: string) {
    return estado.pedidos.some((p) => p.slug === slug && p.userId === estado.euId);
  }

  function aprovarEntrada(slug: string, userId: string, aceitar: boolean) {
    setEstado((s) => {
      const pedidos = s.pedidos.filter((p) => !(p.slug === slug && p.userId === userId));
      if (!aceitar) return { ...s, pedidos };
      const alvo = s.usuariosExtra.find((u) => u.id === userId) || usuariosBase.find((u) => u.id === userId);
      if (!alvo) return { ...s, pedidos };
      return {
        ...s,
        pedidos,
        usuariosExtra: upsertUser(s.usuariosExtra, {
          ...alvo,
          comunidades: alvo.comunidades.includes(slug) ? alvo.comunidades : [...alvo.comunidades, slug],
        }),
      };
    });
  }

  function removerMembro(slug: string, userId: string) {
    if (userId === estado.euId) return;
    setEstado((s) => {
      const alvo = s.usuariosExtra.find((u) => u.id === userId) || usuariosBase.find((u) => u.id === userId);
      if (!alvo) return s;
      return {
        ...s,
        usuariosExtra: upsertUser(s.usuariosExtra, {
          ...alvo,
          comunidades: alvo.comunidades.filter((c) => c !== slug),
        }),
      };
    });
  }

  function editarComunidade(slug: string, dados: Partial<Comunidade>) {
    setEstado((s) => {
      const base = comunidades.find((c) => c.slug === slug);
      if (!base) return s;
      const atualizada = { ...base, ...dados, slug };
      return {
        ...s,
        comunidadesExtra: [...s.comunidadesExtra.filter((c) => c.slug !== slug), atualizada],
      };
    });
  }

  function excluirComunidade(slug: string) {
    setEstado((s) => ({
      ...s,
      comunidadesRemovidas: [...s.comunidadesRemovidas, slug],
      comunidadesExtra: s.comunidadesExtra.filter((c) => c.slug !== slug),
      postsComunidade: s.postsComunidade.filter((p) => p.comunidadeSlug !== slug),
      pedidos: s.pedidos.filter((p) => p.slug !== slug),
      usuariosExtra: s.usuariosExtra.map((u) => ({
        ...u,
        comunidades: u.comunidades.filter((c) => c !== slug),
      })),
    }));
  }

  function apagarConta() {
    setEstado((s) => ({
      ...s,
      euId: usuarioLogadoId,
      contas: s.contas.filter((c) => c.userId !== s.euId),
      usuariosExtra: s.usuariosExtra.filter((u) => u.id !== s.euId),
    }));
  }


  useEffect(() => {
    if (!pronto || !estado.euId) return;
    const tick = () =>
      setEstado((s) => ({ ...s, lastSeen: { ...(s.lastSeen || {}), [s.euId]: Date.now() } }));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [pronto, estado.euId]);

  const ehAdmin = estado.euId === ADMIN_ID || estado.contas.some((c) => c.userId === estado.euId && c.email === ADMIN_EMAIL);

  function denunciarConta(id: string, motivo: string) {
    if (id === estado.euId) return "Você não denuncia a própria conta.";
    if (estado.denuncias.some((d) => d.de === estado.euId && d.para === id)) return "Você já denunciou esta conta.";
    const agora = Date.now();
    const nova = { id: "dn" + agora, de: estado.euId, para: id, motivo: motivo || "violação", em: agora, valida: true };
    const validas = [...estado.denuncias.filter((d) => d.para === id && d.valida), nova];
    const ultimoBan = [...estado.punicoes].reverse().find((p) => p.userId === id && p.tipo === "ban7");
    const depoisDoBan = ultimoBan ? validas.filter((d) => d.em > (ultimoBan.ate || ultimoBan.em)) : [];
    let punicoes = estado.punicoes;
    let banidos = estado.banidos;
    if (!ultimoBan && validas.length >= 5) {
      punicoes = [...punicoes, { userId: id, tipo: "ban7", em: agora, ate: agora + 7 * 24 * 60 * 60 * 1000 }];
    } else if (ultimoBan && depoisDoBan.length >= 5) {
      const janela = agora - 30 * 24 * 60 * 60 * 1000;
      if (depoisDoBan.filter((d) => d.em >= janela).length >= 5) {
        punicoes = [...punicoes, { userId: id, tipo: "excluido", em: agora }];
        banidos = [...banidos, id];
      }
    }
    setEstado((s) => ({ ...s, denuncias: [...s.denuncias, nova], punicoes, banidos }));
    return "ok";
  }

  function banirUsuario(id: string) {
    if (id === ADMIN_ID) return;
    setEstado((s) => ({
      ...s,
      banidos: [...s.banidos, id],
      contas: s.contas.filter((c) => c.userId !== id),
      usuariosExtra: s.usuariosExtra.filter((u) => u.id !== id),
      euId: s.euId === id ? ADMIN_ID : s.euId,
    }));
  }

  function pedirReset(email: string) {
    const e = email.includes("@") ? email.trim().toLowerCase() : email.replace(/\D/g, "");
    const c = estado.contas.find((x) => x.email === e);
    if (!c && !e) return { erro: "Coloca o WhatsApp da conta." };
    const codigo = String(Math.floor(100000 + Math.random() * 900000));
    const payload = { email: e || c?.email, token: codigo, exp: Date.now() + 20 * 60 * 1000 };
    localStorage.setItem("pinguork-reset", JSON.stringify(payload));
    const sb = getSupabase();
    if (sb && e && !e.includes("@")) void sb.from("contas_cpf").update({ senha: c?.senha }).eq("cpf", e);
    return { ok: "Código gerado. Em breve ele chega no WhatsApp.", link: codigo };
  }

  function resetComToken(token: string, nova: string) {
    try {
      const raw = localStorage.getItem("pinguork-reset");
      if (!raw) return "Código inválido ou já usado.";
      const p = JSON.parse(raw) as { email: string; token: string; exp: number };
      if (p.token !== token) return "Código inválido.";
      if (Date.now() > p.exp) return "Código expirado. Peça outro.";
      const r = redefinirSenha(p.email, nova);
      if (r === "ok") {
        localStorage.removeItem("pinguork-reset");
        const sb = getSupabase();
        if (sb && p.email && !String(p.email).includes("@")) void sb.from("contas_cpf").update({ senha: nova }).eq("cpf", p.email);
      }
      return r;
    } catch {
      return "Código inválido.";
    }
  }

  function garantirChave() {
    const c = estado.contas.find((x) => x.userId === estado.euId);
    if (!c) return "";
    if (c.chave) return c.chave;
    const chave = Array.from({ length: 8 }, () => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]).join("");
    setEstado((s) => ({
      ...s,
      contas: s.contas.map((x) => (x.userId === s.euId ? { ...x, chave } : x)),
    }));
    const sb = getSupabase();
    if (sb && c.email && !c.email.includes("@")) void sb.from("contas_cpf").update({ chave }).eq("cpf", c.email);
    return chave;
  }

  function redefinirSenha(email: string, nova: string) {
    const e = email.includes("@") ? email.trim().toLowerCase() : email.replace(/\D/g, "");
    const c = estado.contas.find((x) => x.email === e);
    if (!c) return "Esse WhatsApp não tem conta neste navegador.";
    setEstado((s) => ({
      ...s,
      contas: s.contas.map((x) => (x.email === e ? { ...x, senha: nova } : x)),
    }));
    const sb = getSupabase();
    if (sb && !e.includes("@")) void sb.from("contas_cpf").update({ senha: nova }).eq("cpf", e);
    return "ok";
  }

  function criarComunidade(nome: string, descricao?: string, capa?: string, tipo: Comunidade["tipo"] = "aberta") {
    const slug = slugify(nome);
    if (comunidades.some((c) => c.slug === slug)) {
      toggleComunidade(slug);
      return;
    }
    const nova: Comunidade = {
      slug,
      nome: nome.trim(),
      membros: "1",
      descricao: descricao?.trim() || "Comunidade criada agora no Deu Pingu.",
      cor: "#EC407A",
      donoId: estado.euId,
      capa,
      tipo,
      restrita: tipo === "fechada",
    };
    setEstado((s) => {
      const atual = s.usuariosExtra.find((u) => u.id === s.euId) || usuariosBase.find((u) => u.id === s.euId);
      if (!atual) return { ...s, comunidadesExtra: [...s.comunidadesExtra, nova] };
      return {
        ...s,
        comunidadesExtra: [...s.comunidadesExtra, nova],
        usuariosExtra: upsertUser(s.usuariosExtra, { ...atual, comunidades: [...atual.comunidades, slug] }),
      };
    });
    const sb = getSupabase();
    if (sb) void sb.from("comunidades_app").upsert({ slug, nome: nova.nome, descricao: nova.descricao, capa: nova.capa || null, tipo: nova.tipo, dono_id: nova.donoId });
  }

  function ehDono(slug: string) {
    const c = comunidades.find((x) => x.slug === slug);
    return c?.donoId === estado.euId || !c?.donoId || estado.euId === ADMIN_ID;
  }

  function publicarComunidade(slug: string, texto: string, midia?: string, video?: boolean) {
    const erro = checarPublicacao(texto);
    if (erro) return erro;
    const c = comunidades.find((x) => x.slug === slug);
    const precisaModerar = c?.tipo === "moderada" || c?.tipo === "fechada" || c?.restrita;
    const status: "pendente" | "publicado" = ehDono(slug) || !precisaModerar ? "publicado" : "pendente";
    setEstado((s) => ({
      ...s,
      postsComunidade: [
        { id: "pc" + Date.now(), comunidadeSlug: slug, autorId: s.euId, texto, midia, video, status },
        ...s.postsComunidade,
      ],
    }));
  }

  function moderarPost(id: string, aceitar: boolean) {
    setEstado((s) => ({
      ...s,
      postsComunidade: aceitar
        ? s.postsComunidade.map((p) => (p.id === id ? { ...p, status: "publicado" as const } : p))
        : s.postsComunidade.filter((p) => p.id !== id),
    }));
  }

  function comentar(postId: string, texto: string, comunidadeSlug?: string) {
    const erro = checarPublicacao(texto);
    if (erro) return erro;
    const status: "pendente" | "publicado" = comunidadeSlug && !ehDono(comunidadeSlug) ? "pendente" : "publicado";
    setEstado((s) => ({
      ...s,
      comentarios: [{ id: "c" + Date.now(), postId, autorId: s.euId, texto, status }, ...s.comentarios],
    }));
  }

  function moderarComentario(id: string, aceitar: boolean) {
    setEstado((s) => ({
      ...s,
      comentarios: aceitar
        ? s.comentarios.map((c) => (c.id === id ? { ...c, status: "publicado" as const } : c))
        : s.comentarios.filter((c) => c.id !== id),
    }));
  }

  function reagir(alvo: string, tipo: "like" | "dislike") {
    setEstado((s) => {
      const sem = s.reacoes.filter((r) => !(r.alvo === alvo && r.de === s.euId));
      const ja = s.reacoes.find((r) => r.alvo === alvo && r.de === s.euId && r.tipo === tipo);
      return { ...s, reacoes: ja ? sem : [...sem, { alvo, de: s.euId, tipo }] };
    });
  }

  function contaReacao(alvo: string, tipo: "like" | "dislike") {
    return estado.reacoes.filter((r) => r.alvo === alvo && r.tipo === tipo).length;
  }

  function addStory(midia: string, video: boolean, arquivoNome?: string) {
    const erro = checarPublicacao("", arquivoNome);
    if (erro) return erro;
    const id = "st" + Date.now();
    void (async () => {
      let url = midia;
      if (midia.startsWith("data:")) url = await enviarMidia(midia, `${estado.euId}/${id}`);
      setEstado((s) => ({
        ...s,
        stories: [{ id, autorId: s.euId, midia: url, video, criadoEm: Date.now() }, ...s.stories],
      }));
      const sb = getSupabase();
      if (sb) await sb.from("stories").insert({ id, autor_id: estado.euId, midia: url, video, criado_em: Date.now() });
    })();
  }

  function apagarStory(id: string) {
    setEstado((s) => ({ ...s, stories: s.stories.filter((x) => !(x.id === id && x.autorId === s.euId)) }));
  }

  function segue(id: string) {
    return (eu.seguindo || []).includes(id);
  }

  function toggleSeguir(id: string) {
    if (id === estado.euId) return;
    setEstado((s) =>
      patchEu(s, (u) => {
        const lista = u.seguindo || [];
        return { ...u, seguindo: lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id] };
      })
    );
  }

  function editarPost(id: string, legenda: string) {
    const erro = checarPublicacao(legenda);
    if (erro) return erro;
    setEstado((s) => ({
      ...s,
      posts: s.posts.map((p) => (p.id === id && p.autorId === s.euId ? { ...p, legenda } : p)),
    }));
    return "ok";
  }

  function apagarPost(id: string) {
    const admin = estado.euId === ADMIN_ID || estado.contas.some((c) => c.userId === estado.euId && c.email === ADMIN_EMAIL);
    setEstado((s) => ({
      ...s,
      posts: s.posts.filter((p) => p.id !== id),
      postsComunidade: s.postsComunidade.filter((p) => p.id !== id),
      comentarios: s.comentarios.filter((c) => c.postId !== id && c.id !== id),
      stories: s.stories.filter((st) => st.id !== id),
    }));
  }

  function apagarComentario(id: string) {
    setEstado((s) => ({ ...s, comentarios: s.comentarios.filter((c) => c.id !== id) }));
  }

  const CUSTO: Record<Campanha["objetivo"], number> = {
    Reconhecimento: 0.08,
    Tráfego: 0.12,
    Engajamento: 0.1,
    Leads: 0.25,
    App: 0.4,
    Vendas: 2,
  };

  function criarCampanha(dados: Omit<Campanha, "id" | "donoId" | "status" | "conversoes" | "gasto" | "motivo">) {
    const texto = `${dados.titulo} ${dados.texto} ${dados.url} ${dados.nome}`;
    const erro = checarPublicacao(texto);
    const proib = /golpe|piramid|enriquecer rapido|garantido|milagre|ódio|odio|nude/i.test(texto);
    let status: Campanha["status"] = "aprovado";
    let motivo = "";
    if (erro || proib) {
      status = "reprovado";
      motivo = erro || "Violação das políticas Pinguads (promessa enganosa ou conteúdo proibido).";
    }
    const c: Campanha = {
      ...dados,
      id: "ad" + Date.now(),
      donoId: estado.euId,
      status,
      motivo,
      conversoes: 0,
      gasto: 0,
    };
    setEstado((s) => ({ ...s, campanhas: [c, ...s.campanhas] }));
    return status === "aprovado" ? "ok" : motivo;
  }

  function pausarCampanha(id: string) {
    setEstado((s) => ({
      ...s,
      campanhas: s.campanhas.map((c) =>
        c.id === id && c.donoId === s.euId ? { ...c, status: c.status === "pausado" ? "aprovado" : "pausado" } : c
      ),
    }));
  }

  const [embaralha] = useState(() => Math.random());

  const feedOrdenado = useMemo(() => {
    const seg = eu.seguindo || [];
    return [...estado.posts]
      .filter((p) => p.tipo !== "scrap")
      .map((p) => {
        const autor = getUsuario(p.autorId);
        let score = 0;
        if (p.autorId === eu.id) score += 8;
        if (seg.includes(p.autorId)) score += 40;
        if (autor) {
          const comuns = autor.comunidades.filter((c) => eu.comunidades.includes(c)).length;
          score += comuns * 12;
          if (autor.intencao === eu.intencao) score += 10;
          if (autor.cidade === eu.cidade) score += 6;
        }
        if (p.tipo === "foto") score += Math.min(20, (p.curtidas || 0) / 4);
        const likes = estado.reacoes.filter((r) => r.alvo === p.id && r.de === eu.id && r.tipo === "like").length;
        score += likes * 25;
        score += ((p.id.charCodeAt(p.id.length - 1) + embaralha * 100) % 18);
        return { p, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.p);
  }, [estado.posts, estado.reacoes, eu, getUsuario, embaralha]);

  const storiesAtivas = useMemo(
    () => estado.stories.filter((s) => Date.now() - s.criadoEm < 24 * 60 * 60 * 1000),
    [estado.stories]
  );

  function membrosDa(slug: string) {
    return usuarios.filter((u) => u.comunidades.includes(slug));
  }

  const recomendados = useMemo(() => {
    return usuarios
      .filter((u) => u.id !== eu.id)
      .map((u) => {
        const comuns = u.comunidades.filter((c) => eu.comunidades.includes(c)).length;
        const intencao = u.intencao === eu.intencao ? 16 : 0;
        const cidade = u.cidade === eu.cidade ? 18 : 0;
        const idade = Math.abs(u.idade - eu.idade) <= 3 ? 14 : Math.abs(u.idade - eu.idade) <= 7 ? 6 : 0;
        const comportamento = Math.abs(u.avaliacoes.legal - eu.avaliacoes.legal) < 20 ? 8 : 0;
        return { u, score: comuns * 20 + intencao + cidade + idade + comportamento };
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.u);
  }, [usuarios, eu]);

  return (
    <Ctx.Provider
      value={{
        pronto,
        estado,
        eu,
        usuarios,
        comunidades,
        getUsuario,
        entrar,
        login,
        sair,
        mandarScrap,
        publicarFeed,
        mandarDepoimento,
        aceitarDepoimento,
        crush,
        recusarCrush,
        temCrush,
        ehMatch,
        mensagensCom,
        mandarMsg,
        setFoto,
        editarPerfil,
        votar,
        jaVotou,
        toggleComunidade,
        criarComunidade,
        aprovarEntrada,
        removerMembro,
        excluirComunidade,
        editarComunidade,
        pedidoPendente,
        apagarConta,
        redefinirSenha,
        garantirChave,
        pedirReset,
        resetComToken,
        ehAdmin,
        banirUsuario,
        denunciarConta,
        statusConta,
        checar,
        membrosDa,
        recomendados,
        publicarComunidade,
        moderarPost,
        moderarComentario,
        comentar,
        reagir,
        contaReacao,
        ehDono,
        addStory,
        apagarStory,
        storiesAtivas,
        toggleSeguir,
        segue,
        feedOrdenado,
        editarPost,
        apagarPost,
        apagarComentario,
        criarCampanha,
        pausarCampanha,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function usePingu() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePingu fora do provider");
  return ctx;
}
