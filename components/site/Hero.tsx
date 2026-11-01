"use client";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, MoveHorizontal } from "lucide-react";
import type { Hero as HeroT } from "@/lib/types";
import { useIntroDone } from "./Intro";

const ease = [0.76, 0, 0.24, 1] as const;
const soft = [0.22, 1, 0.36, 1] as const;

// Slider covers 05:00 → 20:00
const H0 = 5;
const H1 = 20;
const sunAt = (h: number) => Math.sin((Math.PI * (h - 6)) / 12); // >0 = daylight
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const fmtTime = (h: number) => {
  const hh = Math.floor(h);
  const mm = Math.floor((h - hh) * 60);
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

function Mask({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
  const done = useIntroDone();
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "102%" }}
        animate={done ? { y: "0%" } : {}}
        transition={{ duration: 1.3, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function Readout({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`border-white/15 px-4 py-3 md:px-6 md:py-4 ${className}`}>
      <p className="text-[10.5px] uppercase tracking-[0.16em] text-white/50">{label}</p>
      <p className="display-n mt-1 text-[1.9rem] tabular-nums md:text-[2.6rem]">{children}</p>
    </div>
  );
}

export default function Hero({ hero }: { hero: HeroT }) {
  const done = useIntroDone();
  const ref = useRef<HTMLElement>(null);

  /* ---------- time of day ---------- */
  const hour = useMotionValue(5.4);
  const [h, setH] = useState(5.4);
  const [touched, setTouched] = useState(false);
  useMotionValueEvent(hour, "change", setH);

  useEffect(() => {
    if (!done) return;
    const d = new Date();
    const local = d.getHours() + d.getMinutes() / 60;
    const target = local > 7 && local < 17.5 ? local : 11.5; // show daylight at night
    const c = animate(hour, target, { duration: 3.2, ease: soft, delay: 0.5 });
    return () => c.stop();
  }, [done, hour]);

  const s = sunAt(h);
  const day = clamp(s, 0, 1);
  const kw = 5 * day;
  // kWh produced since 06:00 on a 5 kW roof → ₹8/unit
  const kwh = h <= 6 ? 0 : h >= 18 ? (5 * 12 * 2) / Math.PI : ((5 * 12) / Math.PI) * (1 - Math.cos((Math.PI * (h - 6)) / 12));
  const elevation = Math.round(day * 72);

  // lighting of the photograph
  const imgFilter = `brightness(${0.42 + 0.68 * day}) saturate(${0.75 + 0.45 * day}) contrast(${1.05 + 0.1 * (1 - day)})`;
  const warm = s > 0 ? (1 - s) * 0.6 : 0.15;
  const night = clamp(-s * 3 + 0.05, 0, 0.82);
  const pct = ((h - H0) / (H1 - H0)) * 100;

  /* ---------- scroll ---------- */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} data-nav="dark" className="relative flex h-[100svh] min-h-[640px] flex-col overflow-hidden bg-night text-white">
      {/* photograph with live day-cycle lighting */}
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <motion.img
          src={hero.image}
          alt="Solar rooftop"
          className="h-full w-full object-cover"
          style={{ filter: imgFilter }}
          initial={{ scale: 1.35 }}
          animate={done ? { scale: 1.1 } : {}}
          transition={{ duration: 3, ease: soft }}
        />
      </motion.div>
      <div className="absolute inset-0 mix-blend-overlay" style={{ background: "linear-gradient(180deg, var(--accent), var(--accent-2))", opacity: warm }} />
      <div className="absolute inset-0" style={{ background: "#050a1c", opacity: night }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/5 to-black/70" />
      {/* stars at night */}
      <div className="absolute inset-0" style={{ opacity: Math.min(1, night * 1.2) }}>
        {Array.from({ length: 50 }).map((_, i) => (
          <span key={i} className="absolute h-[2px] w-[2px] bg-white" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 45}%`, opacity: ((i * 7) % 10) / 12 }} />
        ))}
      </div>

      {/* engineering grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid grid-cols-4 md:grid-cols-12">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            className={`border-r border-white/[0.07] ${i >= 4 ? "hidden md:block" : ""}`}
            initial={{ scaleY: 0 }}
            animate={done ? { scaleY: 1 } : {}}
            style={{ originY: 0 }}
            transition={{ duration: 1.4, ease, delay: 0.05 * i }}
          />
        ))}
      </div>

      {/* content */}
      <motion.div style={{ y: textY, opacity: fade }} className="relative flex flex-1 flex-col px-4 pt-20 md:px-8 md:pt-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={done ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.6 }}
          className="flex items-start justify-between gap-4 text-[11px] uppercase tracking-[0.16em] text-white/75"
        >
          <span>
            <span className="text-[var(--accent)]">[N°01]</span> {hero.eyebrow}
          </span>
          <span className="hidden text-right md:block">
            18.52° N · 73.85° E
            <br />
            Pune, India
          </span>
        </motion.div>

        <div className="mt-auto grid gap-7 pb-6 md:grid-cols-12 md:items-end md:pb-8">
          <h1 className="display text-[clamp(3.6rem,min(17vw,16.5vh),11.5rem)] md:col-span-8">
            <Mask delay={0.1}>{hero.titleLine1}</Mask>
            <Mask delay={0.2} className="text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,0.9)] md:[-webkit-text-stroke:2px_rgba(255,255,255,0.9)]">{hero.titleLine2}</Mask>
            <span className="block overflow-hidden pb-[0.04em]">
              <motion.span
                className="relative inline-block whitespace-nowrap"
                initial={{ y: "102%" }}
                animate={done ? { y: "0%" } : {}}
                transition={{ duration: 1.3, ease, delay: 0.3 }}
              >
                {/* marker block wipes in behind the words */}
                <motion.span
                  aria-hidden
                  className="absolute -inset-x-[0.06em] bottom-[0.02em] top-[0.08em] origin-left bg-[var(--accent)]"
                  initial={{ scaleX: 0 }}
                  animate={done ? { scaleX: 1 } : {}}
                  transition={{ duration: 1.1, ease, delay: 1.1 }}
                />
                <motion.span
                  className="relative"
                  initial={{ color: "#ffffff" }}
                  animate={done ? { color: "#0c0c0d" } : {}}
                  transition={{ duration: 0.4, delay: 1.5 }}
                >
                  {hero.highlight}
                </motion.span>
              </motion.span>
            </span>
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.1, ease: soft, delay: 0.9 }}
            className="md:col-span-4 md:pb-3"
          >
            <p className="max-w-sm text-[15px] leading-relaxed text-white/80 md:text-base">{hero.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/contact"
                className="group relative flex items-center gap-3 overflow-hidden bg-[var(--accent)] py-3.5 pl-5 pr-4 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
                <span className="relative">{hero.ctaPrimary}</span>
                <ArrowUpRight className="relative h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
              </Link>
              <Link
                href="/calculator"
                className="group flex items-center gap-3 border border-white/35 px-5 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-colors duration-500 hover:border-white hover:bg-white/10"
              >
                {hero.ctaSecondary}
                <ArrowDownRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" />
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ---------- instrument panel ---------- */}
      <motion.div
        initial={{ y: "100%" }}
        animate={done ? { y: "0%" } : {}}
        transition={{ duration: 1.2, ease, delay: 0.5 }}
        className="relative border-t border-white/15 bg-black/35 backdrop-blur-xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-[repeat(4,1fr)_1.4fr]">
          <Readout label="Local time" className="border-b border-r md:border-b-0">{fmtTime(h)}</Readout>
          <Readout label="Sun elevation" className="border-b md:border-b-0 md:border-r">{elevation}°</Readout>
          <Readout label="Output · 5 kW roof" className="border-r">
            <span className={kw > 0 ? "" : "text-white/40"}>{kw.toFixed(2)}</span>
            <span className="ml-1 text-base text-white/50">kW</span>
          </Readout>
          <Readout label="Saved today" className="md:border-r">
            ₹{Math.round(kwh * 8).toLocaleString("en-IN")}
          </Readout>
          <Link
            href="/calculator"
            className="hidden items-center justify-between gap-4 bg-[var(--accent)] px-6 text-ink transition-colors duration-500 hover:bg-[var(--accent-2)] md:flex"
          >
            <span>
              <span className="block text-[10.5px] uppercase tracking-[0.16em] opacity-60">Govt. subsidy</span>
              <span className="display-n mt-1 block text-[2.6rem]">{hero.badge.match(/₹[\d,]+/)?.[0] ?? "₹78,000"}</span>
            </span>
            <ArrowUpRight className="h-6 w-6" />
          </Link>
        </div>

        {/* day scrubber */}
        <div className="relative border-t border-white/15 px-5 pb-5 pt-8 md:px-8">
          <div className="relative h-10">
            {/* hour ruler */}
            <div className="absolute inset-x-0 bottom-3 flex justify-between">
              {Array.from({ length: (H1 - H0) * 2 + 1 }).map((_, i) => {
                const hr = H0 + i / 2;
                const major = i % 2 === 0;
                return (
                  <span key={i} className="relative flex flex-col items-center">
                    <span className={`w-px ${major ? "h-3 bg-white/50" : "h-1.5 bg-white/25"}`} />
                    {major && hr % 3 === 0 && (
                      <span className="absolute top-4 text-[10px] tabular-nums text-white/50">{String(hr).padStart(2, "0")}:00</span>
                    )}
                  </span>
                );
              })}
            </div>
            <div className="absolute inset-x-0 bottom-3 h-px bg-white/20" />
            {/* energy harvested so far today */}
            <div
              className="absolute bottom-3 h-[3px] -translate-y-px"
              style={{
                left: `${((6 - H0) / (H1 - H0)) * 100}%`,
                width: `${((clamp(h, 6, 18) - 6) / (H1 - H0)) * 100}%`,
                background: "linear-gradient(90deg, var(--accent-2), var(--accent))",
              }}
            />
            {/* the sun */}
            <div className="pointer-events-none absolute bottom-3 -translate-x-1/2 translate-y-1/2" style={{ left: `${pct}%` }}>
              <span
                className="block h-7 w-7 rounded-full"
                style={{
                  background:
                    s > 0
                      ? "radial-gradient(circle at 40% 35%, #fff4d6, var(--accent-2) 45%, var(--accent))"
                      : "radial-gradient(circle at 35% 35%, #f4f6ff, #9aa7c7)",
                  boxShadow: s > 0 ? "0 0 0 6px rgb(255 160 50 / 0.18), 0 0 30px 6px var(--accent)" : "0 0 18px 2px rgb(160 180 255 / 0.5)",
                }}
              />
              {!touched && done && (
                <motion.span
                  className="absolute -top-7 left-1/2 flex -translate-x-1/2 items-center gap-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-white"
                  animate={{ x: [-4, 4, -4] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MoveHorizontal className="h-3 w-3" /> Drag the sun
                </motion.span>
              )}
            </div>
            <input
              type="range"
              min={H0}
              max={H1}
              step={0.05}
              value={h}
              onChange={(e) => {
                setTouched(true);
                hour.stop();
                hour.set(Number(e.target.value));
              }}
              aria-label="Drag the sun to change the time of day"
              className="absolute inset-0 h-full w-full cursor-grab opacity-0 active:cursor-grabbing"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
