"use client";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, ArrowUpRight, Star, Sun } from "lucide-react";
import type { Hero as HeroT } from "@/lib/types";
import { useIntroDone } from "./Intro";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------- masked line reveal ---------- */
function Line({ children, delay, className = "", inner = "" }: { children: ReactNode; delay: number; className?: string; inner?: string }) {
  const done = useIntroDone();
  return (
    <span className={`inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] align-bottom ${className}`}>
      <motion.span
        className={`inline-block ${inner}`}
        initial={{ y: "105%" }}
        animate={done ? { y: "0%" } : {}}
        transition={{ duration: 1.25, ease, delay }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ---------- real-time sun position ---------- */
function useSun() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (!now) return null;
  const h = now.getHours() + now.getMinutes() / 60;
  const t = (h - 6) / 12; // 06:00 → 0, 18:00 → 1
  const day = t >= 0 && t <= 1;
  const kw = day ? Math.max(0.15, 5 * Math.sin(Math.PI * t)) : 0;
  return { now, t: Math.min(1, Math.max(0, t)), day, kw };
}

function LiveCard() {
  const sun = useSun();
  const done = useIntroDone();
  const kw = useMotionValue(0);
  const [txt, setTxt] = useState("0.00");
  useEffect(() => kw.on("change", (v) => setTxt(v.toFixed(2))), [kw]);
  const target = sun ? Math.round(sun.kw * 100) / 100 : null;
  const isDay = sun?.day ?? false;
  useEffect(() => {
    if (target === null || !done) return;
    const c = animate(kw, target, { duration: 2, ease });
    const id = setInterval(() => {
      if (isDay) animate(kw, target * (0.94 + Math.random() * 0.1), { duration: 1.6 });
    }, 2400);
    return () => {
      c.stop();
      clearInterval(id);
    };
  }, [target, isDay, done, kw]);

  const t = sun?.t ?? 0.5;
  const a = Math.PI * (1 - t);
  const cx = 100 + 82 * Math.cos(a);
  const cy = 92 - 82 * Math.sin(a);

  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] bg-night p-5 text-white">
      <div className="flex items-center justify-between text-[12px] text-white/55">
        <span className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${sun?.day === false ? "bg-sky-400" : "animate-pulse bg-emerald-400"}`} />
          {sun?.day === false ? "Night · battery mode" : "Live rooftop"}
        </span>
        <span className="tabular-nums">
          {sun ? sun.now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
        </span>
      </div>
      <svg viewBox="0 0 200 100" className="mt-2 w-full">
        <defs>
          <linearGradient id="heroArc" x1="0" x2="1">
            <stop offset="0" stopColor="var(--accent)" />
            <stop offset="1" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
        <path d="M18 92 A82 82 0 0 1 182 92" fill="none" stroke="white" strokeOpacity="0.14" strokeDasharray="2 5" />
        <motion.path
          d="M18 92 A82 82 0 0 1 182 92"
          fill="none"
          stroke="url(#heroArc)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={done ? { pathLength: t } : {}}
          transition={{ duration: 2.2, ease, delay: 0.6 }}
        />
        <line x1="4" x2="196" y1="92" y2="92" stroke="white" strokeOpacity="0.15" />
        <motion.circle
          r="8"
          fill="var(--accent-2)"
          initial={{ cx: 18, cy: 92, opacity: 0 }}
          animate={done ? { cx, cy, opacity: 1 } : {}}
          transition={{ duration: 2.2, ease, delay: 0.6 }}
          style={{ filter: "drop-shadow(0 0 10px var(--accent))" }}
        />
      </svg>
      <div>
        <p className="display-n text-[2.6rem] leading-none tabular-nums">
          {txt}
          <span className="ml-1 text-base font-normal text-white/45">kW</span>
        </p>
        <p className="mt-1 text-[12px] text-white/45">Generating right now on a 5 kW roof</p>
      </div>
    </div>
  );
}

/* ---------- rotating circular badge ---------- */
function RoundBadge() {
  const text = "FREE SITE SURVEY • ZERO PAPERWORK • ";
  return (
    <Link
      href="/contact"
      aria-label="Book a free site survey"
      className="group absolute bottom-4 right-4 grid h-28 w-28 place-items-center rounded-full bg-white/85 backdrop-blur-xl transition-transform duration-500 hover:scale-105 md:h-32 md:w-32"
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spin-slow">
        <defs>
          <path id="circ" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-ink text-[8.4px] font-semibold tracking-[0.18em]">
          <textPath href="#circ">{text}</textPath>
        </text>
      </svg>
      <span className="grid h-11 w-11 place-items-center rounded-full sun-bg text-[#1a0d00] transition-transform duration-500 group-hover:rotate-45">
        <ArrowUpRight className="h-5 w-5" />
      </span>
    </Link>
  );
}

export default function Hero({ hero }: { hero: HeroT }) {
  const done = useIntroDone();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });
  const x1 = useTransform(p, [0, 1], ["0%", "-14%"]);
  const x2 = useTransform(p, [0, 1], ["0%", "8%"]);
  const x3 = useTransform(p, [0, 1], ["0%", "-6%"]);
  const imgY = useTransform(p, [0, 1], ["-6%", "14%"]);
  const gridY = useTransform(p, [0, 1], [0, -60]);

  // cursor spotlight
  const mx = useMotionValue(-999);
  const my = useMotionValue(-999);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: 30, filter: "blur(8px)" },
    animate: done ? { opacity: 1, y: 0, filter: "blur(0px)" } : {},
    transition: { duration: 1.1, ease, delay },
  });

  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className="relative overflow-hidden pb-16 pt-28 md:pb-28 md:pt-36"
    >
      {/* editorial column grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden md:block">
        <div className="container-x grid h-full grid-cols-12 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.span
              key={i}
              className="h-full border-l border-ink/[0.045] last:border-r"
              initial={{ scaleY: 0 }}
              animate={done ? { scaleY: 1 } : {}}
              style={{ originY: 0 }}
              transition={{ duration: 1.6, ease, delay: i * 0.04 }}
            />
          ))}
        </div>
      </div>
      <motion.div
        aria-hidden
        style={{ left: sx, top: sy }}
        className="pointer-events-none absolute hidden h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[90px] md:block"
      >
        <div className="h-full w-full rounded-full sun-bg" />
      </motion.div>

      <div className="container-x relative">
        {/* meta row */}
        <motion.div {...reveal(0.05)} className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 py-1.5 pl-1.5 pr-4 text-[13px] ring-1 ring-ink/[0.07] backdrop-blur">
            <span className="rounded-full sun-bg px-2.5 py-0.5 text-[11px] font-semibold text-[#1a0d00]">2026</span>
            {hero.badge}
          </span>
          <span className="hidden items-center gap-2 text-[13px] text-muted md:flex">
            <Sun className="h-3.5 w-3.5 text-[var(--accent)]" /> {hero.eyebrow}
          </span>
        </motion.div>

        {/* headline — staircase layout */}
        <h1 className="display mt-10 text-[clamp(2.6rem,11.6vw,8.6rem)] md:mt-14">
          <motion.span style={{ x: x1 }} className="block">
            <Line delay={0.1}>{hero.titleLine1}</Line>
          </motion.span>
          <motion.span style={{ x: x2 }} className="flex items-center gap-[0.16em] md:pl-[1.6em]">
            <motion.span
              className="relative inline-block h-[0.78em] shrink-0 overflow-hidden rounded-full align-middle"
              initial={{ width: 0 }}
              animate={done ? { width: "1.9em" } : {}}
              transition={{ duration: 1.4, ease, delay: 0.45 }}
            >
              <motion.img
                src={hero.image}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ scale: 1.6 }}
                animate={done ? { scale: 1 } : {}}
                transition={{ duration: 1.8, ease, delay: 0.45 }}
              />
            </motion.span>
            <Line delay={0.22} inner="text-ink/30">{hero.titleLine2}</Line>
          </motion.span>
          <motion.span style={{ x: x3 }} className="block md:text-right">
            {hero.highlight.split(" ").map((w, i, arr) => (
              <span key={i}>
                <Line delay={0.34 + i * 0.08} inner="sun-text pr-[0.04em]">{w}</Line>
                {i < arr.length - 1 ? " " : ""}
              </span>
            ))}
          </motion.span>
        </h1>

        {/* lower bento */}
        <motion.div style={{ y: gridY }} className="mt-12 grid gap-4 md:mt-20 md:grid-cols-12">
          <motion.div {...reveal(0.75)} className="flex flex-col justify-between md:col-span-4 md:pr-6">
            <p className="text-[17px] leading-relaxed text-ink/65 md:text-lg">{hero.subtitle}</p>
            <div className="mt-8">
              <div className="flex flex-col gap-3 sm:flex-row md:flex-col 2xl:flex-row">
                <Link href="/contact" className="btn btn-ink group !justify-between whitespace-nowrap !py-2 !pl-6 !pr-2">
                  {hero.ctaPrimary}
                  <span className="grid h-10 w-10 place-items-center rounded-full sun-bg text-[#1a0d00] transition-transform duration-500 group-hover:rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link href="/calculator" className="group inline-flex items-center gap-2 px-2 py-3 text-[15px] font-medium">
                  <span className="relative">
                    {hero.ctaSecondary}
                    <span className="absolute -bottom-0.5 left-0 h-px w-full origin-right scale-x-100 bg-ink/30 transition-transform duration-500 group-hover:origin-left group-hover:bg-[var(--accent)]" />
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </div>
              <div className="mt-8 flex items-center gap-3 border-t border-ink/[0.08] pt-5">
                <div className="flex -space-x-2.5">
                  {["1507003211169-0a1dd7228f2d", "1494790108377-be9c29b29330", "1500648767791-00dcc994a43e", "1438761681033-6461ffad8d80"].map((id) => (
                    <img key={id} src={`https://images.unsplash.com/photo-${id}?w=80&h=80&fit=crop`} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-paper" />
                  ))}
                </div>
                <div className="text-[13px] leading-tight">
                  <p className="flex items-center gap-1 font-semibold">
                    {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-3 w-3 fill-[var(--accent)] text-[var(--accent)]" />)}
                    <span className="ml-1">4.9</span>
                  </p>
                  <p className="text-muted">4,200+ rooftops powered</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, clipPath: "inset(18% 18% 18% 18% round 28px)" }}
            animate={done ? { opacity: 1, clipPath: "inset(0% 0% 0% 0% round 28px)" } : {}}
            transition={{ duration: 1.5, ease, delay: 0.55 }}
            className="relative h-[420px] overflow-hidden rounded-[28px] md:col-span-5 md:h-[480px]"
          >
            <motion.img src={hero.image} alt="Solar rooftop at sunset" style={{ y: imgY, scale: 1.18 }} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
            <div className="glass absolute left-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12px] font-medium">
              <span className="h-2 w-2 rounded-full sun-bg" />
              12 kW · Koregaon Park, Pune
            </div>
            <div className="absolute bottom-5 left-5 text-white">
              <p className="text-[12px] text-white/70">Bill before → after</p>
              <p className="display-n text-3xl">₹7,400 → ₹380</p>
            </div>
            <RoundBadge />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 md:col-span-3 md:grid-cols-1">
            <motion.div {...reveal(0.8)} className="min-h-[220px]">
              <LiveCard />
            </motion.div>
            <motion.div {...reveal(0.9)}>
              <Link href="/calculator" className="group relative flex h-full min-h-[200px] flex-col justify-between overflow-hidden rounded-[28px] sun-bg p-5 text-[#1a0d00]">
                <span className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/25 blur-xl transition-transform duration-700 group-hover:scale-150" />
                <span className="relative flex items-center justify-between text-[12px] font-medium opacity-70">
                  Govt. subsidy
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-500 group-hover:rotate-45" />
                </span>
                <span className="relative">
                  <span className="display-n block text-[2.6rem] leading-none">₹78,000</span>
                  <span className="mt-1.5 block text-[13px] opacity-75">PM Surya Ghar — we file it end to end.</span>
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
