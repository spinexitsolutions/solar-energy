import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import Services from "@/components/site/Services";
import Process from "@/components/site/Process";
import Packages from "@/components/site/Packages";
import CTA from "@/components/site/CTA";

export const metadata: Metadata = { title: "Solutions" };

export default async function ServicesPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader
        label="Solutions"
        title="Energy systems,"
        highlight="engineered for you."
        subtitle="Residential rooftops, industrial plants, batteries, EV charging and lifetime care — every system is custom-designed using satellite and drone data."
      />
      <Services services={db.services} heading={false} />
      <div className="h-24" />
      <Process steps={db.process} />
      <Packages packages={db.packages} />
      <CTA settings={db.settings} />
    </>
  );
}
