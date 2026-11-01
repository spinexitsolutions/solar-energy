import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { getDB } from "@/lib/db";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
});

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
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
      style={{ ["--accent" as string]: settings.accent, ["--accent-2" as string]: settings.accent2 }}
    >
      <body className="font-sans min-h-dvh">{children}</body>
    </html>
  );
}
