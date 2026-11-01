"use client";
import Link from "next/link";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useIntroDone } from "../Intro";

export const ease = [0.76, 0, 0.24, 1] as const;
export const soft = [0.22, 1, 0.36, 1] as const;

/** Line that slides up from behind a mask once the intro has finished. */
export function Mask({ children, delay, className = "" }: { children: ReactNode; delay: number; className?: string }) {
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

/** Highlight words with a solid accent block that wipes in behind them. */
export function Marker({ children, delay, dark = false }: { children: ReactNode; delay: number; dark?: boolean }) {
  const done = useIntroDone();
  return (
    <span className="block overflow-hidden pb-[0.04em]">
      <motion.span
        className="relative inline-block whitespace-nowrap"
        initial={{ y: "102%" }}
        animate={done ? { y: "0%" } : {}}
        transition={{ duration: 1.3, ease, delay }}
      >
        <motion.span
          aria-hidden
          className="absolute -inset-x-[0.06em] bottom-[0.02em] top-[0.08em] origin-left bg-[var(--accent)]"
          initial={{ scaleX: 0 }}
          animate={done ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, ease, delay: delay + 0.8 }}
        />
        <motion.span
          className="relative"
          initial={{ color: dark ? "#ffffff" : "#0c0c0d" }}
          animate={done ? { color: "#0c0c0d" } : {}}
          transition={{ duration: 0.4, delay: delay + 1.2 }}
        >
          {children}
        </motion.span>
      </motion.span>
    </span>
  );
}

export function PrimaryCta({ href = "/contact", children, invert = false }: { href?: string; children: ReactNode; invert?: boolean }) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-3 overflow-hidden bg-[var(--accent)] py-3.5 pl-5 pr-4 text-[12.5px] font-semibold uppercase tracking-[0.1em] text-ink"
    >
      <span className={`absolute inset-0 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:scale-x-100 ${invert ? "bg-ink" : "bg-white"}`} />
      <span className={`relative transition-colors duration-500 ${invert ? "group-hover:text-white" : ""}`}>{children}</span>
      <ArrowUpRight className={`relative h-4 w-4 transition-all duration-500 group-hover:rotate-45 ${invert ? "group-hover:text-[var(--accent)]" : ""}`} />
    </Link>
  );
}

export function GhostCta({ href = "/calculator", children, dark = false }: { href?: string; children: ReactNode; dark?: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 border px-5 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.1em] transition-colors duration-500 ${
        dark ? "border-white/35 hover:border-white hover:bg-white/10" : "border-ink/25 hover:border-ink hover:bg-ink hover:text-white"
      }`}
    >
      {children}
      <ArrowDownRight className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-45" />
    </Link>
  );
}

export function useReveal() {
  const done = useIntroDone();
  return (delay: number, y = 30) => ({
    initial: { opacity: 0, y },
    animate: done ? { opacity: 1, y: 0 } : {},
    transition: { duration: 1.1, ease: soft, delay },
  });
}
