import { getDB } from "@/lib/db";
import { IntroProvider } from "@/components/site/Intro";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import SmoothScroll from "@/components/site/SmoothScroll";
import FloatingWhatsApp from "@/components/site/FloatingWhatsApp";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const db = await getDB();
  return (
    <IntroProvider intro={db.intro}>
      <SmoothScroll />
      <Navbar nav={db.nav} settings={db.settings} />
      <main className="overflow-x-clip">{children}</main>
      <Footer settings={db.settings} nav={db.nav} services={db.services} />
      <FloatingWhatsApp number={db.settings.whatsapp} />
    </IntroProvider>
  );
}
