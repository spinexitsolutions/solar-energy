"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, type MotionValue } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import type { NavLink, Settings } from "@/lib/types";
import { useIntroDone } from "./Intro";

const ease = [0.22, 1, 0.36, 1] as const;

export function SunMark({ progress, size = 30 }: { progress?: MotionValue<number>; size?: number }) {
  const r = size / 2 - 1.5;
  return (
    <span className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeOpacity={0.12} strokeWidth={2} />
        {progress && (
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="url(#sunStroke)"
            strokeWidth={2}
            strokeLinecap="round"
            style={{ pathLength: progress }}
          />
        )}
        <defs>
          <linearGradient id="sunStroke" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-2)" />
          </linearGradient>
        </defs>
      </svg>
      <span className="h-[46%] w-[46%] rounded-full sun-bg animate-pulse-sun" />
    </span>
  );
}

export default function Navbar({ nav, settings }: { nav: NavLink[]; settings: Settings }) {
  const pathname = usePathname();
  const introDone = useIntroDone();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [compact, setCompact] = useState(false);
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hoverIsland, setHoverIsland] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setCompact(y > 140 && y > prev);
    // adapt island theme to whatever section sits under it
    const el = document
      .elementsFromPoint(window.innerWidth / 2, 40)
      .find((n) => !n.closest("header"));
    setDark(!!el?.closest("[data-nav='dark']"));
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const isCompact = compact && !hoverIsland && !open;
  const tone = dark && !open ? "glass-dark text-white ring-white/10" : "glass text-ink ring-ink/5";

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 md:pt-5"
        initial={{ y: -120, opacity: 0 }}
        animate={introDone ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 1.1, ease, delay: 0.25 }}
      >
        {/* ---------- Desktop island ---------- */}
        <motion.nav
          layout
          onHoverStart={() => setHoverIsland(true)}
          onHoverEnd={() => {
            setHoverIsland(false);
            setHovered(null);
          }}
          style={{ borderRadius: 999 }}
          transition={{ layout: { duration: 0.6, ease } }}
          className={`hidden items-center gap-1 p-1.5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.35)] ring-1 transition-colors duration-500 lg:flex ${tone}`}
        >
          <motion.div layout="position">
            <Link href="/" className="flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-3">
              <SunMark progress={progress} />
              <span className="display-n text-[15px]">{settings.brandName}</span>
            </Link>
          </motion.div>

          <AnimatePresence initial={false} mode="popLayout">
            {!isCompact && (
              <motion.ul
                key="links"
                className="flex items-center"
                initial={{ opacity: 0, filter: "blur(6px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(6px)" }}
                transition={{ duration: 0.35 }}
              >
                {nav.map((l) => (
                  <li key={l.href} className="relative" onMouseEnter={() => setHovered(l.href)}>
                    {hovered === l.href && (
                      <motion.span
                        layoutId="nav-hover"
                        className={`absolute inset-0 rounded-full ${dark ? "bg-white/10" : "bg-ink/[0.06]"}`}
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <Link
                      href={l.href}
                      className={`relative block px-4 py-2 text-[14px] tracking-tight transition-opacity ${
                        isActive(l.href) ? "opacity-100" : "opacity-60 hover:opacity-100"
                      }`}
                    >
                      {l.label}
                      {isActive(l.href) && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full sun-bg"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </motion.ul>
            )}
            {isCompact && (
              <motion.span
                key="compact"
                className="px-2 text-[13px] opacity-60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                exit={{ opacity: 0 }}
              >
                {nav.find((l) => isActive(l.href))?.label ?? "Menu"}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.div layout="position">
            <Link href="/contact" className="btn btn-sun ml-1 !py-2.5 !pl-4 !pr-3 text-[14px]">
              Get a quote
              <span className="grid h-6 w-6 place-items-center rounded-full bg-black/10">
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          </motion.div>
        </motion.nav>

        {/* ---------- Mobile island ---------- */}
        <motion.nav
          layout
          style={{ borderRadius: open ? 30 : 999 }}
          transition={{ layout: { duration: 0.7, ease } }}
          className={`w-full max-w-[640px] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.35)] ring-1 transition-colors duration-500 lg:hidden ${
            open ? "bg-night text-white ring-white/10" : tone
          }`}
        >
          <motion.div layout="position" className="flex items-center justify-between p-1.5">
            <Link href="/" className="flex items-center gap-2.5 py-1 pl-2">
              <SunMark progress={progress} />
              <span className="display-n text-[15px]">{settings.brandName}</span>
            </Link>
            <div className="flex items-center gap-1.5">
              {!open && (
                <Link href="/contact" className="btn btn-sun !px-4 !py-2 text-[13px]">
                  Quote
                </Link>
              )}
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className={`relative grid h-10 w-10 place-items-center rounded-full ${open ? "bg-white/10" : "bg-ink/[0.06]"}`}
              >
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded bg-current"
                  animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                  transition={{ duration: 0.45, ease }}
                />
                <motion.span
                  className="absolute h-[1.5px] w-4 rounded bg-current"
                  animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                  transition={{ duration: 0.45, ease }}
                />
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {open && (
              <motion.div
                key="sheet"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                className="flex max-h-[calc(100dvh-5rem)] flex-col overflow-y-auto px-5 pb-5"
                data-lenis-prevent
              >
                <ul className="mt-4 border-t border-white/10">
                  {nav.map((l, i) => (
                    <motion.li
                      key={l.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, ease, delay: 0.1 + i * 0.05 }}
                      className="border-b border-white/10"
                    >
                      <Link href={l.href} className="group flex items-center justify-between py-4">
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono text-[11px] text-white/35">0{i + 1}</span>
                          <span
                            className={`text-[2rem] font-medium tracking-[-0.04em] ${
                              isActive(l.href) ? "sun-text" : "text-white"
                            }`}
                          >
                            {l.label}
                          </span>
                        </span>
                        <ArrowUpRight className="h-5 w-5 text-white/40 transition group-active:rotate-45" />
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease, delay: 0.45 }}
                  className="mt-6 grid gap-3"
                >
                  <Link href="/contact" className="btn btn-sun w-full !py-4">
                    Book a free site survey <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn w-full bg-white/10 !py-4 text-white">
                    <Phone className="h-4 w-4" /> {settings.phone}
                  </a>
                  <p className="eyebrow mt-2 text-center text-white/35">{settings.hours}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </motion.header>

      {/* dim backdrop behind open mobile island */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
