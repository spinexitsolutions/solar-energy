"use client";
import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 40,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "section" | "span";
}) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </M>
  );
}

/** Masked line-by-line / word-by-word headline reveal. */
export function SplitReveal({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  wordClassName,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  wordClassName?: (word: string, i: number) => string | undefined;
}) {
  const words = text.split(" ");
  const container: Variants = { show: { transition: { staggerChildren: stagger, delayChildren: delay } } };
  const child: Variants = {
    hidden: { y: "110%", rotate: 4 },
    show: { y: "0%", rotate: 0, transition: { duration: 1.05, ease } },
  };
  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom" aria-hidden>
          <motion.span variants={child} className={`inline-block origin-bottom-left ${wordClassName?.(w, i) ?? ""}`}>
            {w}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export function SectionLabel({ index, children, dark }: { index?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className={`eyebrow flex items-center gap-3 ${dark ? "text-white/60" : "text-muted"}`}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inset-0 rounded-full sun-bg animate-ping opacity-60" />
        <span className="relative h-2 w-2 rounded-full sun-bg" />
      </span>
      {index && <span className={dark ? "text-white/40" : "text-ink/40"}>{index}</span>}
      <span>{children}</span>
    </div>
  );
}
