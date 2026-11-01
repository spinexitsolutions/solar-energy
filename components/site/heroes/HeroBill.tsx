"use client";
import { animate, motion, useMotionValue } from "motion/react";
import { useEffect, useState } from "react";
import type { Hero as HeroT, Project } from "@/lib/types";
import { useIntroDone } from "../Intro";
import { GhostCta, Mask, PrimaryCta, ease, useReveal } from "./shared";

const BILLS = [3000, 7400, 12000, 25000];
const afterSolar = (b: number) => Math.max(180, Math.round((b * 0.05) / 10) * 10);

function Rupees({ value, delay = 0 }: { value: number; delay?: number }) {
  const done = useIntroDone();
  const v = useMotionValue(value);
  const [t, setT] = useState(value.toLocaleString("en-IN"));
  useEffect(() => v.on("change", (x) => setT(Math.round(x).toLocaleString("en-IN"))), [v]);
  useEffect(() => {
    if (!done) return;
    const c = animate(v, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1], delay });
    return () => c.stop();
  }, [value, done, v, delay]);
  return <span className="tabular-nums">₹{t}</span>;
}

/** Light editorial hero: a newspaper front page where the electricity bill gets struck out. */
export default function HeroBill({ hero, projects }: { hero: HeroT; projects: Project[] }) {
  const done = useIntroDone();
  const reveal = useReveal();
  const [bill, setBill] = useState(7400);
  const [date, setDate] = useState("");
  useEffect(() => setDate(new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })), []);
  const after = afterSolar(bill);
  const col = [...projects, ...projects];

  return (
    <section className="relative bg-paper pt-14 md:pt-16">
      {/* masthead strip */}
      <motion.div {...reveal(0.1, -8)} className="flex items-center justify-between border-b border-ink/15 px-5 py-2.5 text-[10.5px] uppercase tracking-[0.18em] text-ink/60 md:px-8">
        <span>{date || " "}</span>
        <span className="hidden md:block">The Rooftop Times · Edition N°26</span>
        <span>Pune · ₹8 / unit</span>
      </motion.div>

      <div className="grid border-b border-ink/15 md:grid-cols-12">
        <div className="flex flex-col px-5 pb-8 pt-8 md:col-span-8 md:px-8 md:pb-10 md:pt-10">
          <motion.p {...reveal(0.2, 10)} className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            Breaking · {hero.badge}
          </motion.p>
          <h1 className="display mt-4 text-[clamp(3.2rem,min(12.5vw,11vh),8rem)]">
            <Mask delay={0.15}>
              {hero.titleLine1} {hero.titleLine2}
            </Mask>
            <Mask delay={0.25} className="text-[var(--accent)]">{hero.highlight}</Mask>
          </h1>

          {/* the bill */}
          <motion.div {...reveal(0.6)} className="mt-8 border-y-2 border-ink py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/60">Your monthly electricity bill</p>
              <div className="flex flex-wrap gap-1">
                {BILLS.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBill(b)}
                    className={`border px-3 py-1.5 text-[12px] font-medium tabular-nums transition-colors duration-300 ${
                      bill === b ? "border-ink bg-ink text-white" : "border-ink/20 hover:border-ink"
                    }`}
                  >
                    ₹{b.toLocaleString("en-IN")}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-x-6 gap-y-2">
              <div className="relative">
                <p className="text-[10.5px] uppercase tracking-[0.16em] text-ink/50">Before</p>
                <p className="display-n text-[clamp(3.4rem,11vw,7.5rem)] leading-none text-ink/35">
                  <Rupees value={bill} />
                </p>
                <motion.span
                  key={bill}
                  aria-hidden
                  className="absolute left-0 right-0 top-[58%] h-[0.5rem] origin-left bg-ink"
                  initial={{ scaleX: 0 }}
                  animate={done ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, ease, delay: 0.9 }}
                />
              </div>
              <span className="display-n mb-3 text-5xl text-ink/30">→</span>
              <div>
                <p className="text-[10.5px] uppercase tracking-[0.16em] text-ink/50">With Lumora solar</p>
                <p className="display-n text-[clamp(3.4rem,11vw,7.5rem)] leading-none">
                  <span className="mark">
                    <Rupees value={after} delay={0.4} />
                  </span>
                </p>
              </div>
            </div>
            <p className="mt-3 text-[13px] text-ink/60">
              That’s <b className="text-ink">₹{((bill - after) * 12).toLocaleString("en-IN")}</b> back in your pocket every year — and{" "}
              <b className="text-ink">₹{((bill - after) * 12 * 25 * 1.3).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</b> over 25 years.
            </p>
          </motion.div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 md:items-end">
            <motion.p {...reveal(0.8)} className="text-[15px] leading-relaxed text-ink/70 md:columns-1">
              {hero.subtitle}
            </motion.p>
            <motion.div {...reveal(0.9)} className="flex flex-wrap gap-2 md:justify-end">
              <PrimaryCta invert>{hero.ctaPrimary}</PrimaryCta>
              <GhostCta>{hero.ctaSecondary}</GhostCta>
            </motion.div>
          </div>
        </div>

        {/* vertical photo columns */}
        <div className="relative h-[60vh] overflow-hidden border-t border-ink/15 md:col-span-4 md:h-auto md:border-l md:border-t-0">
          <div className="absolute inset-0 grid grid-cols-2 gap-2 p-2">
            {[0, 1].map((k) => (
              <div key={k} className="relative overflow-hidden">
                <motion.div
                  className="flex flex-col gap-2"
                  animate={{ y: k === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                >
                  {(k === 0 ? col : [...col].reverse()).map((p, i) => (
                    <figure key={`${p.id}-${i}`} className="relative">
                      <img src={p.image} alt={p.title} className="aspect-[3/4] w-full object-cover grayscale-[35%] transition duration-700 hover:grayscale-0" />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-2.5 text-white">
                        <span className="display-n block text-xl">{p.title}</span>
                        <span className="block text-[10px] uppercase tracking-[0.12em] text-white/70">{p.capacity} · {p.savings}</span>
                      </figcaption>
                    </figure>
                  ))}
                </motion.div>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-paper to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-paper to-transparent" />
        </div>
      </div>
    </section>
  );
}
