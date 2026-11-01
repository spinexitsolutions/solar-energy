"use client";
import { motion, useScroll, useTransform, useMotionValueEvent } from "motion/react";
import { useRef, useState } from "react";
import type { Step } from "@/lib/types";
import { SectionLabel } from "./Reveal";

export default function Process({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(steps.length - 1, Math.floor(v * steps.length))));

  // sun travels along a semicircle: angle 180° → 0°
  const angle = useTransform(scrollYProgress, [0, 1], [Math.PI, 0]);
  const cx = useTransform(angle, (a) => 200 + 170 * Math.cos(a));
  const cy = useTransform(angle, (a) => 200 - 170 * Math.sin(a));
  const sky = useTransform(scrollYProgress, [0, 0.5, 1], ["#1b1408", "#3a2207", "#1b1408"]);

  return (
    <section ref={ref} data-nav="dark" className="relative bg-night text-white" style={{ height: `${steps.length * 75 + 50}vh` }}>
      <div className="sticky top-0 flex h-dvh items-center overflow-hidden">
        <motion.div className="absolute inset-0" style={{ background: sky, opacity: 0.6 }} />
        <div className="container-x relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <div className="pt-16 md:pt-0">
            <SectionLabel index="03" dark>How it works</SectionLabel>
            <h2 className="display mt-5 text-[11vw] md:text-7xl">
              Sunrise to <span className="sun-text">switch-on</span> in 30 days.
            </h2>
            <div className="relative mx-auto mt-12 hidden max-w-[420px] md:block">
              <svg viewBox="0 0 400 215" className="w-full">
                <path d="M30 200 A170 170 0 0 1 370 200" fill="none" stroke="white" strokeOpacity="0.15" strokeDasharray="2 7" />
                <motion.path
                  d="M30 200 A170 170 0 0 1 370 200"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  style={{ pathLength: scrollYProgress }}
                />
                <line x1="0" x2="400" y1="200" y2="200" stroke="white" strokeOpacity="0.2" />
                {steps.map((_, i) => {
                  const a = Math.PI - (Math.PI * (i + 0.5)) / steps.length;
                  return (
                    <circle
                      key={i}
                      cx={200 + 170 * Math.cos(a)}
                      cy={200 - 170 * Math.sin(a)}
                      r={4}
                      fill={i <= active ? "var(--accent-2)" : "rgba(255,255,255,0.25)"}
                    />
                  );
                })}
                <motion.circle r="16" cx={cx} cy={cy} fill="var(--accent-2)" style={{ filter: "drop-shadow(0 0 18px var(--accent))" }} />
              </svg>
              <p className="absolute inset-x-0 bottom-1 text-center font-mono text-xs text-white/50">
                Step {active + 1} of {steps.length}
              </p>
            </div>
            <div className="mt-6 flex gap-1.5 md:hidden">
              {steps.map((_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${i <= active ? "sun-bg" : "bg-white/15"}`} />
              ))}
            </div>
          </div>

          <ol className="relative space-y-2 md:space-y-3">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <motion.li
                  key={i}
                  animate={{ opacity: on ? 1 : i < active ? 0.35 : 0.25 }}
                  transition={{ duration: 0.5 }}
                  className={`rounded-3xl p-4 transition-colors duration-500 md:p-6 ${on ? "bg-white/[0.07] ring-1 ring-white/10" : ""}`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className={`font-mono text-sm ${on ? "sun-text" : "text-white/40"}`}>0{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="display-n text-lg md:text-2xl">{s.title}</h3>
                        <span className="eyebrow text-white/40">{s.duration}</span>
                      </div>
                      <motion.div
                        initial={false}
                        animate={{ height: on ? "auto" : 0, opacity: on ? 1 : 0 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pt-2 text-[15px] leading-relaxed text-white/60 md:text-base">{s.description}</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
