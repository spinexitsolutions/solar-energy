import type { Metadata, Viewport } from "next";
import { Archivo, Onest } from "next/font/google";
import { getDB } from "@/lib/db";
import "./globals.css";

const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo" });
const sans = Onest({ subsets: ["latin"], variable: "--font-onest" });

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings, hero } = await getDB();
  return {
    title: {
      default: `${settings.brandName} — ${settings.tagline}`,
      template: `%s · ${settings.brandName}`,
    },
    description: hero.subtitle,
    openGraph: { images: [hero.image], title: settings.brandName, description: hero.subtitle },
  };
}

export const viewport: Viewport = {
  themeColor: "#f6f5f1",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getDB();
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      style={{ ["--accent" as string]: settings.accent, ["--accent-2" as string]: settings.accent2 }}
    >
      <body className="font-sans min-h-dvh">{children}</body>
    </html>
  );
}
