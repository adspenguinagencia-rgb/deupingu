import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  return NextResponse.json({
    temUrl: url.includes("supabase.co"),
    temChave: key.length > 10,
  });
}

export async function POST(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.json({ ok: false, error: "Supabase sem chave na Vercel" }, { status: 500 });
  const body = await req.json();
  const sb = createClient(url, key);
  const cpf = String(body.cpf || "").replace(/\D/g, "") || String(body.cpf || body.userId || "");
  if (!cpf) return NextResponse.json({ ok: false, error: "Sem WhatsApp na conta" }, { status: 400 });

  let foto = body.foto || null;
  if (typeof foto === "string" && foto.startsWith("data:")) {
    const [, b64] = foto.split(",");
    const bin = Buffer.from(b64 || "", "base64");
    const path = `avatars/${cpf}-${Date.now()}.jpg`;
    const up = await sb.storage.from("midia").upload(path, bin, { contentType: "image/jpeg", upsert: true });
    if (up.error) return NextResponse.json({ ok: false, error: "Pasta midia: " + up.error.message }, { status: 400 });
    foto = sb.storage.from("midia").getPublicUrl(path).data.publicUrl + "?v=" + Date.now();
  }

  const row: Record<string, unknown> = {
      cpf,
      senha: body.senha || "-",
      nome: body.nome || "",
      cidade: body.cidade || "",
      uf: body.uf || "",
      user_id: body.userId || "",
      foto,
      idade: body.idade ? Number(body.idade) : 25,
      sexo: body.sexo || "outro",
      intencao: body.intencao || "",
      frase: body.frase || "",
      apelido: body.apelido || "",
    };
  if (body.chave) row.chave = body.chave;
  const { error } = await sb.from("contas_cpf").upsert(row, { onConflict: "cpf" });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, foto });
}
