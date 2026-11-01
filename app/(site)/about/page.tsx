import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import Stats from "@/components/site/Stats";
import Testimonials from "@/components/site/Testimonials";
import CTA from "@/components/site/CTA";
import { Reveal, SectionLabel } from "@/components/site/Reveal";

export const metadata: Metadata = { title: "About" };

export default async function AboutPage() {
  const db = await getDB();
  const a = db.about;
  return (
    <>
      <PageHeader label="About us" title={a.title} highlight={a.highlight} subtitle={a.intro} image={a.image} />

      <section className="container-x py-20 md:py-32">
        <SectionLabel>Our mission</SectionLabel>
        <Reveal>
          <p className="mt-8 max-w-5xl text-4xl font-medium leading-[1.1] tracking-[-0.04em] md:text-6xl">{a.mission}</p>
        </Reveal>
      </section>

      <Stats stats={db.stats} />

      <section className="container-x py-20 md:py-28">
        <SectionLabel>What we believe</SectionLabel>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {a.values.map((v, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="card h-full p-8 md:p-10">
                <span className="font-mono text-sm sun-text">0{i + 1}</span>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">{v.title}</h3>
                <p className="mt-3 text-muted md:text-lg">{v.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-20 md:py-28">
        <SectionLabel>Leadership</SectionLabel>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {a.team.map((m, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="group">
                <div className="aspect-[3/4] overflow-hidden rounded-[4px] bg-paper-2">
                  <img src={m.photo} alt={m.name} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                </div>
                <p className="mt-4 font-semibold tracking-tight">{m.name}</p>
                <p className="text-sm text-muted">{m.role}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Testimonials items={db.testimonials} />
      <div className="h-20" />
      <CTA settings={db.settings} />
    </>
  );
}
