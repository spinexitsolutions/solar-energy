import { getDB } from "@/lib/db";
import Hero from "@/components/site/Hero";
import Marquee from "@/components/site/Marquee";
import Statement from "@/components/site/Statement";
import Stats from "@/components/site/Stats";
import Services from "@/components/site/Services";
import Calculator from "@/components/site/Calculator";
import Process from "@/components/site/Process";
import Projects from "@/components/site/Projects";
import Packages from "@/components/site/Packages";
import Testimonials from "@/components/site/Testimonials";
import Faq from "@/components/site/Faq";
import BlogPreview from "@/components/site/BlogPreview";
import CTA from "@/components/site/CTA";

export default async function Home({ searchParams }: { searchParams: Promise<{ hero?: string }> }) {
  const db = await getDB();
  const { hero: heroPreview } = await searchParams;
  const s = db.sections;
  return (
    <>
      <Hero hero={db.hero} projects={db.projects} stats={db.stats} variant={heroPreview} />
      {s.marquee && <Marquee items={db.partners} />}
      {s.statement && <Statement statement={db.statement} />}
      <Stats stats={db.stats} />
      {s.services && <Services services={db.services} />}
      {s.calculator && <Calculator config={db.calculator} />}
      {s.process && <Process steps={db.process} />}
      {s.projects && <Projects projects={db.projects} />}
      {s.packages && <Packages packages={db.packages} />}
      {s.testimonials && <Testimonials items={db.testimonials} />}
      {s.faq && <Faq faqs={db.faqs} />}
      {s.blog && <BlogPreview posts={db.posts.filter((p) => p.published)} />}
      {s.cta && <CTA settings={db.settings} />}
    </>
  );
}
