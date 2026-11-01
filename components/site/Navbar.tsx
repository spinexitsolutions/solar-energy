"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type MotionValue,
} from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import type { NavLink, Settings } from "@/lib/types";
import { useIntroDone } from "./Intro";

const ease = [0.76, 0, 0.24, 1] as const;
const soft = [0.22, 1, 0.36, 1] as const;

/** Square brand mark: a half-sun rising over a horizon line. */
export function SunMark({ size = 28 }: { size?: number; progress?: MotionValue<number> }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden>
      <rect width="28" height="28" fill="currentColor" />
      <path d="M6 18a8 8 0 0 1 16 0Z" fill="var(--accent)" />
      <rect x="4" y="19.5" width="20" height="1.6" fill="var(--accent-2)" />
    </svg>
  );
}

function useClock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const id = setInterval(() => setT(new Date()), 20_000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function Navbar({ nav, settings }: { nav: NavLink[]; settings: Settings }) {
  const pathname = usePathname();
  const introDone = useIntroDone();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [hidden, setHidden] = useState(false);
  const [dark, setDark] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const now = useClock();

  const detect = () => {
    const el = document.elementsFromPoint(window.innerWidth / 2, 30).find((n) => !n.closest("header"));
    setDark(!!el?.closest("[data-nav='dark']"));
  };

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > 240 && y > prev + 2);
    if (y < prev - 2) setHidden(false);
    setScrolled(y > 20);
    detect();
  });

  useEffect(() => {
    setOpen(false);
    const ids = [60, 400, 1200].map((t) => setTimeout(detect, t));
    return () => ids.forEach(clearTimeout);
  }, [pathname, introDone]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const h = now ? now.getHours() + now.getMinutes() / 60 : 12;
  const kw = Math.max(0, 5 * Math.sin((Math.PI * (h - 6)) / 12));

  const onDark = dark && !open;
  const line = onDark ? "border-white/15" : "border-ink/10";
  const tone = onDark
    ? `text-white ${scrolled ? "bg-black/25 backdrop-blur-xl" : "bg-transparent"}`
    : "bg-paper/85 text-ink backdrop-blur-xl";

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: "-100%" }}
        animate={introDone ? { y: hidden && !open ? "-100%" : "0%" } : {}}
        transition={{ duration: 0.7, ease: soft }}
      >
        <div className={`flex h-14 items-stretch border-b transition-colors duration-500 md:h-16 ${line} ${tone}`}>
          {/* brand */}
          <Link href="/" className={`flex shrink-0 items-center gap-3 border-r px-4 md:px-6 ${line}`}>
            <span className={onDark ? "text-white" : "text-ink"}>
              <SunMark />
            </span>
            <span className="display-n text-[1.6rem] leading-none tracking-[0.02em]">{settings.brandName}</span>
          </Link>

          {/* index links */}
          <nav className="hidden lg:flex">
            {nav.map((l, i) => {
              const active = isActive(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`group relative flex items-center gap-2 overflow-hidden whitespace-nowrap border-r px-5 text-[12.5px] font-medium uppercase tracking-[0.1em] ${line}`}
                >
                  <span
                    className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-y-100 ${
                      onDark ? "bg-white" : "bg-ink"
                    }`}
                  />
                  <span
                    className={`relative tabular-nums text-[10px] transition-colors duration-500 ${
                      active ? "text-[var(--accent)]" : onDark ? "text-white/45 group-hover:text-ink/50" : "text-ink/40 group-hover:text-white/50"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span className={`relative transition-colors duration-500 ${onDark ? "group-hover:text-ink" : "group-hover:text-white"}`}>
                    {l.label}
                  </span>
                  {active && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--accent)]" transition={{ duration: 0.5, ease: soft }} />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* live instrument readout */}
          <div className={`hidden items-center gap-3 whitespace-nowrap border-l px-5 text-[12px] uppercase tracking-[0.08em] xl:flex ${line}`}>
            <span className={`h-1.5 w-1.5 ${kw > 0 ? "animate-pulse bg-emerald-400" : "bg-sky-400"}`} />
            <span className="tabular-nums opacity-70">
              {now ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }) : "--:--"} IST
            </span>
            <span className="tabular-nums">
              {kw > 0 ? `${kw.toFixed(2)} kW` : "Battery mode"}
            </span>
          </div>

          <a
            href={`tel:${settings.phone.replace(/\s/g, "")}`}
            className={`hidden items-center gap-2 whitespace-nowrap border-l px-5 text-[12.5px] font-medium tracking-[0.04em] md:flex lg:hidden 2xl:flex ${line}`}
          >
            <Phone className="h-3.5 w-3.5" /> {settings.phone}
          </a>

          {/* CTA block */}
          <Link
            href="/contact"
            className="group relative hidden items-center gap-3 overflow-hidden whitespace-nowrap bg-[var(--accent)] px-6 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink sm:flex"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100" />
            <span className="relative transition-colors duration-500 group-hover:text-white">Get a quote</span>
            <ArrowUpRight className="relative h-4 w-4 transition-all duration-500 group-hover:rotate-45 group-hover:text-[var(--accent)]" />
          </Link>

          {/* menu toggle (mobile / tablet) */}
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`relative flex w-14 items-center justify-center border-l lg:hidden ${line} ${open ? "bg-[var(--accent)] text-ink" : ""}`}
          >
            <motion.span className="absolute h-[2px] w-5 bg-current" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} transition={{ duration: 0.5, ease }} />
            <motion.span className="absolute h-[2px] w-5 bg-current" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} transition={{ duration: 0.5, ease }} />
          </button>
        </div>
        {/* scroll progress hairline */}
        <motion.div style={{ scaleX: progress }} className="h-[2px] origin-left bg-[var(--accent)]" />
      </motion.header>

      {/* full-screen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-14 text-white lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease }}
            data-lenis-prevent
          >
            <div className="flex-1 overflow-y-auto">
              <ul>
                {nav.map((l, i) => (
                  <li key={l.href} className="overflow-hidden border-b border-white/10">
                    <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "100%" }} transition={{ duration: 0.8, ease, delay: 0.15 + i * 0.05 }}>
                      <Link href={l.href} className="group flex items-end justify-between px-5 py-3">
                        <span className="flex items-start gap-3">
                          <span className="mt-2 text-[11px] tabular-nums text-white/40">0{i + 1}</span>
                          <span className={`display text-[17vw] leading-[0.9] sm:text-8xl ${isActive(l.href) ? "text-[var(--accent)]" : ""}`}>{l.label}</span>
                        </span>
                        <ArrowUpRight className="mb-3 h-7 w-7 text-white/40 transition group-active:rotate-45" />
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 border-t border-white/10 text-[12px] uppercase tracking-[0.08em]"
            >
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="border-r border-white/10 p-5">
                <span className="block text-white/40">Call</span>
                <span className="mt-1 block normal-case tracking-normal">{settings.phone}</span>
              </a>
              <div className="p-5">
                <span className="block text-white/40">Hours</span>
                <span className="mt-1 block normal-case tracking-normal">{settings.hours}</span>
              </div>
              <Link href="/contact" className="col-span-2 flex items-center justify-between bg-[var(--accent)] p-5 text-[13px] font-semibold text-ink">
                Book free site survey <ArrowUpRight className="h-5 w-5" />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
