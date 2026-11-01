"use client";
import { animate, motion, useMotionValue, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Hero as HeroT, Stat } from "@/lib/types";
import { useIntroDone } from "../Intro";
import { GhostCta, Marker, Mask, PrimaryCta, ease, useReveal } from "./shared";

const ROWS = 3;
const COLS = 3;

function Counter({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const done = useIntroDone();
  const v = useMotionValue(0);
  const [t, setT] = useState("0");
  useEffect(() => v.on("change", (x) => setT(x.toLocaleString("en-IN", { maximumFractionDigits: decimals, minimumFractionDigits: decimals }))), [v, decimals]);
  useEffect(() => {
    if (!done) return;
    const c = animate(v, to, { duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 1.2 });
    return () => c.stop();
  }, [done, to, v]);
  return <span className="tabular-nums">{t}</span>;
}

/** Light hero: the photograph is split into a 3×3 array of "solar cells" that power on one by one. */
export default function HeroCells({ hero, stats }: { hero: HeroT; stats: Stat[] }) {
  const done = useIntroDone();
  const reveal = useReveal();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gridY = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const [lit, setLit] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative bg-paper pt-14 md:pt-16">
      <div className="grid min-h-[calc(100svh-3.5rem)] border-b border-ink/10 md:min-h-[calc(100svh-4rem)] md:grid-cols-2">
        {/* copy column */}
        <div className="flex flex-col justify-between border-ink/10 md:border-r">
          <motion.div {...reveal(0.1, 10)} className="flex items-center justify-between border-b border-ink/10 px-5 py-4 text-[11px] uppercase tracking-[0.16em] text-ink/60 md:px-10">
            <span><span className="text-[var(--accent)]">[N°01]</span> {hero.eyebrow}</span>
            <span className="hidden sm:block">Est. 2016</span>
          </motion.div>

          <div className="px-5 py-10 md:px-10">
            <h1 className="display text-[clamp(3.6rem,min(15vw,14vh),9.5rem)] md:text-[clamp(3.6rem,min(7.6vw,14vh),9.5rem)]">
              <Mask delay={0.1}>{hero.titleLine1}</Mask>
              <Mask delay={0.2} className="text-ink/25">{hero.titleLine2}</Mask>
              <Marker delay={0.3}>{hero.highlight}</Marker>
            </h1>
            <motion.p {...reveal(0.8)} className="mt-7 max-w-md text-[16px] leading-relaxed text-ink/65">
              {hero.subtitle}
            </motion.p>
            <motion.div {...reveal(0.9)} className="mt-7 flex flex-wrap gap-2">
              <PrimaryCta invert>{hero.ctaPrimary}</PrimaryCta>
              <GhostCta>{hero.ctaSecondary}</GhostCta>
            </motion.div>
          </div>

          <div className="grid grid-cols-3 border-t border-ink/10">
            {stats.slice(0, 3).map((s, i) => (
              <motion.div key={i} {...reveal(1 + i * 0.08, 16)} className={`px-5 py-5 md:px-10 ${i < 2 ? "border-r border-ink/10" : ""}`}>
                <p className="display-n text-[2.1rem] leading-none md:text-[3rem]">
                  <Counter to={s.value} decimals={s.decimals} />
                  <span className="text-[var(--accent)]">{s.suffix}</span>
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-ink/55">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* solar-cell grid */}
        <div className="relative h-[70vh] overflow-hidden bg-ink md:h-auto">
          <motion.div style={{ y: gridY }} className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-[3px] p-[3px]">
            {Array.from({ length: ROWS * COLS }).map((_, i) => {
              const r = Math.floor(i / COLS);
              const c = i % COLS;
              const order = r + c; // diagonal power-on wave
              return (
                <motion.div
                  key={i}
                  onHoverStart={() => setLit(i)}
                  onHoverEnd={() => setLit(null)}
                  className="relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.86, filter: "brightness(0.2)" }}
                  animate={done ? { opacity: 1, scale: 1, filter: lit === i ? "brightness(1.25)" : "brightness(1)" } : {}}
                  transition={{ duration: 1.1, ease, delay: done && lit === null ? 0.35 + order * 0.12 : 0 }}
                >
                  <div
                    className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] hover:scale-110"
                    style={{
                      backgroundImage: `url(${hero.image})`,
                      backgroundSize: `${COLS * 100}% ${ROWS * 100}%`,
                      backgroundPosition: `${(c / (COLS - 1)) * 100}% ${(r / (ROWS - 1)) * 100}%`,
                    }}
                  />
                  {/* photovoltaic cell lines */}
                  <div
                    className="pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px)",
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <span className="absolute left-2 top-2 font-medium tabular-nums text-[10px] tracking-[0.12em] text-white/70">
                    {String.fromCharCode(65 + r)}
                    {c + 1}
                  </span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* glare sweep */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
            style={{ background: "linear-gradient(90deg, transparent, rgba(255,214,120,0.35), transparent)" }}
            initial={{ left: "-40%" }}
            animate={done ? { left: ["-40%", "140%"] } : {}}
            transition={{ duration: 2.4, ease: "easeInOut", delay: 1.6, repeat: Infinity, repeatDelay: 4 }}
          />

          <motion.div
            {...reveal(1.4, 20)}
            className="absolute bottom-4 left-4 right-4 flex items-end justify-between bg-paper p-4 md:bottom-6 md:left-6 md:right-auto md:w-80"
          >
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.16em] text-ink/50">Array status</p>
              <p className="display-n mt-1 text-[2.2rem] leading-none">9 / 9 cells live</p>
            </div>
            <span className="mb-1 h-2.5 w-2.5 animate-pulse bg-emerald-500" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
