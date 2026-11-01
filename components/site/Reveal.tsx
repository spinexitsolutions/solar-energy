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
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease }}
      className={`inline-flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3.5 text-[13px] font-medium ring-1 ${
        dark ? "bg-white/[0.04] text-white/80 ring-white/10" : "bg-white/60 text-ink/80 ring-ink/[0.08]"
      }`}
    >
      <span className="grid h-6 min-w-6 place-items-center rounded-full sun-bg px-1.5 text-[11px] font-semibold tabular-nums text-[#1a0d00]">
        {index ?? "●"}
      </span>
      {children}
    </motion.div>
  );
}
