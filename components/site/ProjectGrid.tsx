"use client";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { MapPin } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? projects : projects.filter((p) => p.category === cat);

  return (
    <section className="container-x pb-24">
      <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
        {cats.map((c) => (
          <button key={c} onClick={() => setCat(c)} className="relative shrink-0 rounded-full px-5 py-2.5 text-sm">
            {cat === c && <motion.span layoutId="proj-cat" className="absolute inset-0 rounded-full bg-ink" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            <span className={`relative ${cat === c ? "text-white" : "text-ink/60"}`}>{c}</span>
          </button>
        ))}
      </div>
      <motion.div layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.article
              layout
              key={p.id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-[2rem] ${i % 5 === 0 ? "aspect-[4/5] lg:row-span-2 lg:aspect-auto" : "aspect-[4/3]"}`}
            >
              <img src={p.image} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition duration-[1.4s] group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium">{p.category}</span>
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="flex items-center gap-1.5 text-sm text-white/70"><MapPin className="h-3.5 w-3.5" />{p.location} · {p.year}</p>
                <h3 className="display-n mt-1 text-2xl">{p.title}</h3>
                <div className="mt-3 flex gap-2 text-sm">
                  <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur">{p.capacity}</span>
                  <span className="rounded-full sun-bg px-3 py-1 font-medium text-[#1a0d00]">{p.savings}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
