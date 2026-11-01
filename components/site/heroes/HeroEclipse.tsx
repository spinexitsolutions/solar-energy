"use client";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import type { Hero as HeroT, Stat } from "@/lib/types";
import { useIntroDone } from "../Intro";
import { GhostCta, Mask, PrimaryCta, soft, useReveal } from "./shared";

/** Dark hero: a giant sun made of solar panels rises behind the headline, ringed by rotating stats. */
export default function HeroEclipse({ hero, stats }: { hero: HeroT; stats: Stat[] }) {
  const done = useIntroDone();
  const reveal = useReveal();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 22 });
  const sunScale = useTransform(p, [0, 1], [1, 1.9]);
  const sunY = useTransform(p, [0, 1], ["0%", "-12%"]);
  const textY = useTransform(p, [0, 1], ["0%", "60%"]);
  const ringRotate = useTransform(p, [0, 1], [0, 140]);

  const ring = stats.map((s) => `${s.value.toLocaleString("en-IN")}${s.suffix} ${s.label}`).join("  ✦  ") + "  ✦  ";

  return (
    <section ref={ref} data-nav="dark" className="relative h-[100svh] min-h-[700px] overflow-hidden bg-night text-white">
      {/* stars */}
      <div className="absolute inset-0 opacity-60">
        {Array.from({ length: 70 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute h-[2px] w-[2px] bg-white"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 53) % 100}%` }}
            animate={{ opacity: [0.15, 0.9, 0.15] }}
            transition={{ duration: 2 + (i % 5), repeat: Infinity, delay: (i % 7) * 0.3 }}
          />
        ))}
      </div>

      {/* horizon glow */}
      <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "radial-gradient(60% 80% at 50% 100%, color-mix(in oklab, var(--accent) 45%, transparent), transparent 70%)" }} />

      {/* the sun */}
      <motion.div style={{ scale: sunScale, y: sunY }} className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2">
        <motion.div
          initial={{ y: "70%", opacity: 0 }}
          animate={done ? { y: "0%", opacity: 1 } : {}}
          transition={{ duration: 2.4, ease: soft, delay: 0.1 }}
          className="relative h-[min(86vw,66vh)] w-[min(86vw,66vh)]"
        >
          <div className="absolute -inset-[18%] rounded-full opacity-70 blur-3xl" style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 62%)" }} />
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <img src={hero.image} alt="" className="h-full w-full scale-125 object-cover" />
            <div className="absolute inset-0 mix-blend-color" style={{ background: "linear-gradient(160deg, var(--accent-2), var(--accent))" }} />
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 35% 30%, rgba(255,245,220,0.55), transparent 55%)" }} />
          </div>
          {/* rotating stats ring */}
          <motion.svg style={{ rotate: ringRotate }} viewBox="0 0 200 200" className="absolute -inset-[11%] h-[122%] w-[122%]">
            <defs>
              <path id="eclipseRing" d="M100,100 m-94,0 a94,94 0 1,1 188,0 a94,94 0 1,1 -188,0" />
            </defs>
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
              <text className="fill-white/70 text-[5.2px] font-medium uppercase tracking-[0.2em]">
                <textPath href="#eclipseRing" textLength="586" lengthAdjust="spacing">{ring}</textPath>
              </text>
            </motion.g>
          </motion.svg>
        </motion.div>
      </motion.div>

      {/* headline over the sun */}
      <motion.div style={{ y: textY }} className="absolute inset-x-0 top-[52%] -translate-y-1/2 px-4 text-center mix-blend-difference">
        <h1 className="display text-[clamp(3.8rem,min(19vw,19vh),15rem)] text-white">
          <Mask delay={0.6}>{hero.titleLine1}</Mask>
          <Mask delay={0.7}>
            {hero.titleLine2} {hero.highlight}
          </Mask>
        </h1>
      </motion.div>

      {/* top + bottom rails */}
      <motion.div {...reveal(0.4, -10)} className="absolute inset-x-0 top-14 flex justify-between px-4 pt-6 text-[11px] uppercase tracking-[0.16em] text-white/65 md:top-16 md:px-8">
        <span><span className="text-[var(--accent)]">[N°01]</span> {hero.eyebrow}</span>
        <span className="hidden md:block">{hero.badge}</span>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 grid gap-5 border-t border-white/15 bg-night/40 px-4 py-5 backdrop-blur-md md:grid-cols-[1fr_auto] md:items-center md:px-8">
        <motion.p {...reveal(1.1, 20)} className="max-w-xl text-[15px] leading-relaxed text-white/75">
          {hero.subtitle}
        </motion.p>
        <motion.div {...reveal(1.2, 20)} className="flex flex-wrap gap-2">
          <PrimaryCta>{hero.ctaPrimary}</PrimaryCta>
          <GhostCta dark>{hero.ctaSecondary}</GhostCta>
        </motion.div>
      </div>
    </section>
  );
}
