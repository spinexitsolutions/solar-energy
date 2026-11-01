"use client";
import Link from "next/link";
import { motion, useScroll, useTransform, animate, useMotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Leaf, Zap } from "lucide-react";
import type { Hero as HeroT } from "@/lib/types";
import { useIntroDone } from "./Intro";

const ease = [0.22, 1, 0.36, 1] as const;

function Word({ children, delay, className = "" }: { children: React.ReactNode; delay: number; className?: string }) {
  const done = useIntroDone();
  return (
    <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
      <motion.span
        className={`inline-block ${className}`}
        initial={{ y: "115%", rotate: 3 }}
        animate={done ? { y: "0%", rotate: 0 } : {}}
        transition={{ duration: 1.2, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function LiveKw() {
  const v = useMotionValue(4.2);
  const [txt, setTxt] = useState("4.20");
  useEffect(() => {
    const unsub = v.on("change", (x) => setTxt(x.toFixed(2)));
    const id = setInterval(() => {
      animate(v, 4.1 + Math.random() * 0.9, { duration: 1.4, ease: "easeInOut" });
    }, 1800);
    return () => {
      clearInterval(id);
      unsub();
    };
  }, [v]);
  return <span className="tabular-nums">{txt}</span>;
}

export default function Hero({ hero }: { hero: HeroT }) {
  const done = useIntroDone();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: cardP } = useScroll({ target: cardRef, offset: ["start end", "start start"] });
  const inset = useTransform(cardP, [0, 1], [5, 0]);
  const radius = useTransform(cardP, [0, 1], [32, 0]);
  const clip = useTransform([inset, radius], ([i, r]) => `inset(0% ${i}% 0% ${i}% round ${r}px)`);
  const imgScale = useTransform(cardP, [0, 1], [1.25, 1]);
  const widgetsY = useTransform(cardP, [0, 1], [80, 0]);

  return (
    <section ref={ref} className="relative pt-28 md:pt-40">
      {/* ambient sun glow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[70vh] w-[120vw] -translate-x-1/2 opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, color-mix(in oklab, var(--accent-2) 30%, transparent), transparent 70%)",
        }}
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 0.8 } : {}}
        transition={{ duration: 2 }}
      />

      <motion.div style={{ y: titleY, opacity: titleOpacity }} className="container-x relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full bg-white/80 py-1.5 pl-1.5 pr-4 text-[13px] shadow-sm ring-1 ring-ink/5"
        >
          <span className="rounded-full sun-bg px-2 py-0.5 text-[11px] font-semibold text-[#1a0d00]">NEW</span>
          <span className="text-ink/75">{hero.badge}</span>
        </motion.div>

        <h1 className="display text-[15vw] sm:text-[12vw] md:text-[8.5rem] lg:text-[10rem]">
          <Word delay={0.15}>{hero.titleLine1}</Word>
          <br />
          <Word delay={0.28} className="text-ink/35">{hero.titleLine2}</Word>{" "}
          <Word delay={0.4} className="serif-i sun-text pr-[0.06em] text-[1.08em]">{hero.highlight}</Word>
        </h1>

        <motion.p
          className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-muted md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.7 }}
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease, delay: 0.85 }}
        >
          <Link href="/contact" className="btn btn-ink w-full !px-7 !py-4 sm:w-auto">
            {hero.ctaPrimary} <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/calculator" className="btn btn-ghost group w-full !px-7 !py-4 sm:w-auto">
            {hero.ctaSecondary}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </motion.div>

      {/* expanding image card */}
      <div ref={cardRef} className="relative mt-16 md:mt-24">
        <motion.div
          style={{ clipPath: clip }}
          initial={{ opacity: 0, y: 80 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.4, ease, delay: 0.6 }}
          className="relative h-[78vh] min-h-[520px] overflow-hidden md:h-[100vh]"
        >
          <motion.img
            src={hero.image}
            alt="Solar panels on a modern home at sunset"
            style={{ scale: imgScale }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/10" />

          <motion.div style={{ y: widgetsY }} className="absolute inset-x-0 bottom-0 p-4 md:p-10">
            <div className="mx-auto flex max-w-[1320px] flex-col gap-3 md:flex-row md:items-end md:justify-between">
              {/* live generation widget */}
              <div className="glass-dark w-full rounded-3xl p-5 text-white ring-1 ring-white/10 md:w-[340px]">
                <div className="flex items-center justify-between">
                  <span className="eyebrow flex items-center gap-2 text-white/60">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live generation
                  </span>
                  <Zap className="h-4 w-4 text-sun-2" />
                </div>
                <p className="mt-3 text-5xl font-semibold tracking-[-0.04em]">
                  <LiveKw /> <span className="text-xl font-normal text-white/50">kW</span>
                </p>
                <div className="mt-4 flex h-12 items-end gap-1">
                  {[30, 42, 55, 68, 80, 92, 100, 96, 88, 74, 60, 45, 34, 24].map((h, i) => (
                    <motion.span
                      key={i}
                      className="flex-1 rounded-sm sun-bg"
                      initial={{ height: 0 }}
                      animate={done ? { height: `${h}%` } : {}}
                      transition={{ duration: 1, ease, delay: 1.2 + i * 0.04 }}
                      style={{ opacity: 0.35 + h / 160 }}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between font-mono text-[10px] text-white/40">
                  <span>06:00</span><span>12:00</span><span>18:00</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:flex">
                <div className="glass rounded-3xl p-5 ring-1 ring-white/30 md:w-52">
                  <p className="eyebrow text-ink/50">Saved this month</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">₹6,240</p>
                  <p className="mt-1 text-xs text-emerald-600">↓ 92% vs last year</p>
                </div>
                <div className="glass rounded-3xl p-5 ring-1 ring-white/30 md:w-52">
                  <p className="eyebrow flex items-center gap-1.5 text-ink/50"><Leaf className="h-3 w-3" /> CO₂ avoided</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">4.7 t</p>
                  <p className="mt-1 text-xs text-ink/50">= 214 trees planted</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
