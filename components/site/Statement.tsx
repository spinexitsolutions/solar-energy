"use client";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import type { Statement as StatementT } from "@/lib/types";

function W({ word, range, p }: { word: string; range: [number, number]; p: MotionValue<number> }) {
  const opacity = useTransform(p, range, [0.14, 1]);
  const blur = useTransform(p, range, ["blur(4px)", "blur(0px)"]);
  return (
    <motion.span style={{ opacity, filter: blur }} className="inline-block">
      {word}&nbsp;
    </motion.span>
  );
}

export default function Statement({ statement }: { statement: StatementT }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const words = statement.text.split(" ");
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const sunY = useTransform(scrollYProgress, [0, 1], ["60%", "-10%"]);

  return (
    <section ref={ref} data-nav="dark" className="relative h-[260vh] bg-night text-white">
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <motion.img
          src={statement.image}
          alt=""
          aria-hidden
          style={{ scale: bgScale }}
          className="absolute inset-0 h-full w-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-night via-night/40 to-night" />
        <motion.div
          aria-hidden
          style={{ y: sunY }}
          className="absolute -right-[20vw] top-1/2 h-[60vw] w-[60vw] rounded-full opacity-40 blur-3xl md:-right-[10vw] md:h-[40vw] md:w-[40vw]"
        >
          <div className="h-full w-full rounded-full" style={{ background: "radial-gradient(circle, var(--accent), transparent 65%)" }} />
        </motion.div>
        <div className="container-x relative">
          <p className="eyebrow mb-8 text-white/40">Why solar, why now</p>
          <p className="max-w-5xl text-[8.5vw] font-medium leading-[1.08] tracking-[-0.04em] md:text-6xl lg:text-7xl">
            {words.map((w, i) => {
              const start = (i / words.length) * 0.85;
              return <W key={i} word={w} p={scrollYProgress} range={[start, start + 0.85 / words.length + 0.04]} />;
            })}
          </p>
        </div>
      </div>
    </section>
  );
}
