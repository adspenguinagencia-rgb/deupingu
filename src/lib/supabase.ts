import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null | undefined;

export function supabaseAtivo() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabase() {
  if (client !== undefined) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    client = null;
    return null;
  }
  client = createClient(url, key);
  return client;
}

export async function enviarMidia(dataUrl: string, path: string) {
  const sb = getSupabase();
  if (!sb || !dataUrl.startsWith("data:")) return dataUrl;
  const [meta, b64] = dataUrl.split(",");
  const mime = /data:(.*?);/.exec(meta)?.[1] || "image/jpeg";
  const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  const ext = mime.includes("video") ? "mp4" : "jpg";
  const file = `${path}.${ext}`;
  const { error } = await sb.storage.from("midia").upload(file, bin, { contentType: mime, upsert: true });
  if (error) {
    console.error("upload midia", error.message);
    return dataUrl;
  }
  return sb.storage.from("midia").getPublicUrl(file).data.publicUrl;
}
