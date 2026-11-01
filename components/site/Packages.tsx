"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Package } from "@/lib/types";
import { SectionLabel, SplitReveal } from "./Reveal";

export default function Packages({ packages }: { packages: Package[] }) {
  return (
    <section className="container-x py-20 md:py-32">
      <div className="text-center">
        <div className="flex justify-center"><SectionLabel index="05">Packages</SectionLabel></div>
        <h2 className="display mx-auto mt-6 max-w-4xl text-5xl md:text-7xl">
          <SplitReveal text="Simple, honest" />{" "}
          <SplitReveal text="pricing." delay={0.12} wordClassName={() => "sun-text"} />
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-lg text-muted">All-inclusive. No hidden costs. 0% EMI available on every plan.</p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-3 md:gap-5">
        {packages.map((k, i) => (
          <motion.div
            key={k.id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            whileHover={{ y: -8 }}
            className={`relative flex flex-col overflow-hidden rounded-[2rem] p-7 md:p-8 ${
              k.featured ? "bg-night text-white shadow-[0_40px_80px_-30px_rgba(255,122,26,0.55)]" : "bg-white ring-1 ring-ink/5"
            }`}
          >
            {k.featured && (
              <>
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-50 blur-3xl sun-bg" />
                <span className="absolute right-6 top-6 rounded-full sun-bg px-3 py-1 text-xs font-semibold text-[#1a0d00]">Most chosen</span>
              </>
            )}
            <p className={`eyebrow ${k.featured ? "text-white/50" : "text-muted"}`}>{k.capacity}</p>
            <h3 className="display-n mt-2 text-3xl">{k.name}</h3>
            <p className={`mt-1 text-sm ${k.featured ? "text-white/60" : "text-muted"}`}>{k.ideal}</p>
            <p className="display-n mt-8 text-[2.6rem] leading-none">{k.price}</p>
            <p className={`mt-1 text-sm ${k.featured ? "sun-text" : "text-emerald-600"}`}>{k.priceNote}</p>
            <ul className="relative mt-8 flex-1 space-y-3">
              {k.features.map((f) => (
                <li key={f} className="flex gap-3 text-[15px]">
                  <Check className={`mt-0.5 h-4 w-4 shrink-0 ${k.featured ? "text-sun-2" : "text-sun"}`} strokeWidth={2.5} />
                  <span className={k.featured ? "text-white/85" : "text-ink/80"}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={`/contact?package=${k.id}`} className={`btn relative mt-8 w-full !py-4 ${k.featured ? "btn-sun" : "btn-ink"}`}>
              Choose {k.name} <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
