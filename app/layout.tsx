import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Familjen_Grotesk } from "next/font/google";
import { getDB } from "@/lib/db";
import "./globals.css";

const display = Big_Shoulders({ subsets: ["latin"], axes: ["opsz"], variable: "--font-shoulders", adjustFontFallback: false });
const sans = Familjen_Grotesk({ subsets: ["latin"], variable: "--font-familjen" });

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
  themeColor: "#f3f1ec",
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
