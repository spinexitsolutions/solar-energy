import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import ProjectGrid from "@/components/site/ProjectGrid";
import Stats from "@/components/site/Stats";
import CTA from "@/components/site/CTA";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader
        label="Portfolio"
        title="Rooftops we’ve"
        highlight="turned into power plants."
        subtitle="Homes, housing societies, factories and farms across India — every one monitored live, every day."
      />
      <Stats stats={db.stats} />
      <ProjectGrid projects={db.projects} />
      <CTA settings={db.settings} />
    </>
  );
}
