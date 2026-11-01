"use client";
import { AnimatePresence, motion, animate, useMotionValue, useTransform } from "motion/react";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Intro as IntroT } from "@/lib/types";

const ease = [0.76, 0, 0.24, 1] as const;
const IntroCtx = createContext(true);
export const useIntroDone = () => useContext(IntroCtx);

export function IntroProvider({ intro, children }: { intro: IntroT; children: ReactNode }) {
  const [show, setShow] = useState(intro.enabled);
  const [done, setDone] = useState(!intro.enabled);

  useEffect(() => {
    if (!intro.enabled) return;
    const skip =
      new URLSearchParams(location.search).has("preview") ||
      (intro.oncePerSession && sessionStorage.getItem("lumora-intro") === "1");
    if (skip) {
      setShow(false);
      setDone(true);
      return;
    }
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("lumora-intro", "1");
    }, intro.duration * 1000);
    return () => clearTimeout(t);
  }, [intro]);

  return (
    <IntroCtx.Provider value={done}>
      <AnimatePresence
        onExitComplete={() => {
          document.documentElement.style.overflow = "";
          setDone(true);
        }}
      >
        {show && <IntroOverlay key="intro" intro={intro} />}
      </AnimatePresence>
      {children}
    </IntroCtx.Provider>
  );
}

function IntroOverlay({ intro }: { intro: IntroT }) {
  const d = Math.max(1.6, intro.duration);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, "0"));
  const sunY = useTransform(count, [0, 100], ["8%", "-104%"]);
  const glow = useTransform(count, [0, 100], [0.15, 1]);

  useEffect(() => {
    const c = animate(count, 100, { duration: d * 0.82, ease: [0.65, 0, 0.35, 1] });
    return () => c.stop();
  }, [count, d]);

  const letters = intro.word.split("");

  return (
    <motion.div
      className="fixed inset-0 z-[100] overflow-hidden bg-night text-white"
      initial={{ clipPath: "inset(0% 0% 0% 0% round 0px)" }}
      exit={{ clipPath: "inset(0% 0% 100% 0% round 0px 0px 48px 48px)" }}
      transition={{ duration: 1.1, ease }}
      aria-hidden
    >
      {/* sky gradient that warms as the sun rises */}
      <motion.div
        className="absolute inset-0"
        style={{
          opacity: glow,
          background:
            "radial-gradient(120% 70% at 50% 62%, color-mix(in oklab, var(--accent) 38%, transparent) 0%, transparent 60%)",
        }}
      />

      {/* stars */}
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 40 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-px w-px rounded-full bg-white"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 55}%`, opacity: ((i * 7) % 10) / 10 }}
          />
        ))}
      </div>

      {/* horizon & rising sun */}
      <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden">
        <motion.div
          style={{ y: sunY }}
          className="absolute left-1/2 top-full h-[38vmin] w-[38vmin] -translate-x-1/2 rounded-full"
        >
          <div
            className="pointer-events-none absolute -inset-[120%] rounded-full"
            style={{ background: "radial-gradient(circle, color-mix(in oklab, var(--accent) 45%, transparent) 0%, transparent 55%)" }}
          />
          <div
            className="relative h-full w-full rounded-full"
            style={{ background: "radial-gradient(circle at 50% 40%, #fff6dd 0%, var(--accent-2) 35%, var(--accent) 75%)" }}
          />
        </motion.div>
      </div>
      <motion.div
        className="absolute left-0 right-0 top-[62%] h-px origin-center bg-gradient-to-r from-transparent via-white/70 to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1.2, ease }}
      />
      {/* sun reflection on "water" */}
      <motion.div
        className="absolute left-1/2 top-[62%] h-[30vh] w-[30vmin] -translate-x-1/2 blur-2xl"
        style={{
          opacity: glow,
          background: "linear-gradient(to bottom, color-mix(in oklab, var(--accent) 50%, transparent), transparent)",
        }}
      />

      {/* wordmark */}
      <div className="absolute inset-x-0 top-[62%] mt-8 flex flex-col items-center px-6 text-center md:mt-10">
        <h1 className="display flex overflow-hidden text-[16vw] leading-none md:text-[9vw]">
          {letters.map((l, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1, ease, delay: 0.35 + i * 0.06 }}
            >
              {l === " " ? " " : l}
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-3 text-xl text-white/70 md:text-2xl"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
        >
          {intro.subtext}
        </motion.p>
      </div>

      {/* footer readouts */}
      <div className="eyebrow absolute inset-x-0 bottom-0 flex items-end justify-between p-5 text-white/50 md:p-8">
        <span>Solar irradiance</span>
        <span className="font-mono text-4xl tracking-tight text-white md:text-6xl">
          <motion.span>{rounded}</motion.span>
          <span className="text-white/40">%</span>
        </span>
      </div>
    </motion.div>
  );
}
