"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Phone } from "lucide-react";
import type { Settings } from "@/lib/types";

export default function CTA({ settings }: { settings: Settings }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sunY = useTransform(scrollYProgress, [0, 0.6], ["60%", "22%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);

  return (
    <section ref={ref} className="container-x pb-20 md:pb-32">
      <motion.div
        style={{ scale }}
        data-nav="dark"
        className="grain relative overflow-hidden rounded-[2rem] bg-night px-6 pb-16 pt-20 text-center text-white md:rounded-[3rem] md:px-16 md:pb-24 md:pt-32"
      >
        <motion.div
          style={{ y: sunY }}
          className="pointer-events-none absolute left-1/2 top-[45%] h-[90vw] w-[90vw] -translate-x-1/2 rounded-full md:h-[52vw] md:w-[52vw]"
        >
          <div
            className="h-full w-full rounded-full"
            style={{
              background: "radial-gradient(circle at 50% 30%, #fff1c9 0%, var(--accent-2) 22%, var(--accent) 45%, transparent 70%)",
              opacity: 0.85,
            }}
          />
        </motion.div>
        <div className="relative">
          <p className="eyebrow text-white/60">Free site survey · No obligation</p>
          <h2 className="display mx-auto mt-6 max-w-5xl text-[13vw] md:text-8xl">
            Let the sun pay <span className="sun-text">your bills.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-lg text-white/70">
            Book a 20-minute consultation. We’ll design your system, file your subsidy and have you generating in 30 days.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/contact" className="btn btn-white w-full !px-8 !py-4 sm:w-auto">
              Book free survey <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="btn w-full bg-white/10 !px-8 !py-4 text-white backdrop-blur hover:bg-white/20 sm:w-auto">
              <Phone className="h-4 w-4" /> {settings.phone}
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
