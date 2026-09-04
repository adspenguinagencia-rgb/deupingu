"use client";

import Link from "next/link";
import { usePingu } from "@/lib/store";

function reduzir(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const max = 320;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.72));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export function FotoPerfil({ donoId }: { donoId: string }) {
  const { eu, setFoto } = usePingu();
  if (donoId !== eu.id) return null;

  return (
    <div className="mt-3 space-y-2">
      {eu.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={eu.avatar} alt="" className="h-24 w-24 rounded-full object-cover" />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <Link href="/pingu-cara" className="btn-primario">
          PinguCara
        </Link>
        <label className="btn-secundario inline-block cursor-pointer">
          Trocar foto
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const data = await reduzir(file);
              const r = await setFoto(data, file.name);
              if (r !== "ok") alert(r);
              else alert("Foto trocada.");
            }}
          />
        </label>
      </div>
    </div>
  );
}
