import type { Metadata } from "next";
import { Nunito, Nunito_Sans } from "next/font/google";
import { Shell } from "@/components/Shell";
import { PinguProvider } from "@/lib/store";
import "./globals.css";

const display = Nunito({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const sans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Deu Pingu",
  description: "Amizade, scrap e um crush no meio da comunidade.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover" as const,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} h-full antialiased`}>
      <body className="min-h-full font-[family-name:var(--font-sans)]">
        <PinguProvider>
          <Shell>{children}</Shell>
        </PinguProvider>
      </body>
    </html>
  );
}
