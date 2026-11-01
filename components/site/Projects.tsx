"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/lib/types";
import { SectionLabel } from "./Reveal";

export default function Projects({ projects }: { projects: Project[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [projects.length]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="sticky top-0 flex h-dvh flex-col justify-center overflow-hidden">
        <div className="container-x mb-8 flex items-end justify-between gap-6 md:mb-12">
          <div>
            <SectionLabel index="04">Selected work</SectionLabel>
            <h2 className="display mt-5 text-5xl md:text-7xl">
              Proof, <span className="sun-text">installed.</span>
            </h2>
          </div>
          <Link href="/projects" className="btn btn-ghost hidden !py-3 text-sm md:inline-flex">
            All projects <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <motion.div ref={track} style={{ x }} className="flex w-max gap-4 pl-5 pr-5 md:gap-6 md:pl-10 md:pr-10 lg:pl-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
          {projects.map((p, i) => (
            <article
              key={p.id}
              className="group relative h-[58vh] w-[82vw] shrink-0 overflow-hidden rounded-[2rem] sm:w-[60vw] md:h-[62vh] md:w-[38vw] lg:w-[30vw]"
            >
              <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute left-4 right-4 top-4 flex justify-between">
                <span className="glass rounded-full px-3 py-1 text-xs font-medium">{p.category}</span>
                <span className="glass rounded-full px-3 py-1 font-mono text-xs">{p.year}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
                <p className="flex items-center gap-1.5 text-sm text-white/70"><MapPin className="h-3.5 w-3.5" />{p.location}</p>
                <h3 className="display-n mt-1 text-2xl md:text-3xl">{p.title}</h3>
                <div className="mt-4 flex gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm backdrop-blur">{p.capacity}</span>
                  <span className="rounded-full sun-bg px-3 py-1.5 text-sm font-medium text-[#1a0d00]">{p.savings}</span>
                </div>
              </div>
              <span className="absolute right-5 top-14 font-mono text-[11px] text-white/60">{String(i + 1).padStart(2, "0")}</span>
            </article>
          ))}
        </motion.div>

        <div className="container-x mt-8">
          <div className="h-px w-full bg-line">
            <motion.div style={{ width: bar }} className="h-px sun-bg" />
          </div>
        </div>
      </div>
    </section>
  );
}
