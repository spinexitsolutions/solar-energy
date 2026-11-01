"use client";
import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/types";

function Counter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, stat.value, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, stat.value]);
  const d = stat.decimals ?? 0;
  return (
    <span ref={ref} className="tabular-nums">
      {v.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d })}
    </span>
  );
}

export default function Stats({ stats }: { stats: Stat[] }) {
  return (
    <section className="container-x py-20 md:py-32">
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[2rem] bg-line ring-1 ring-line md:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            className="group relative bg-paper p-6 md:p-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.1 }}
          >
            <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 sun-bg transition-transform duration-700 group-hover:scale-x-100" />
            <p className="display-n whitespace-nowrap text-[2rem] leading-none sm:text-5xl lg:text-7xl">
              <Counter stat={s} />
              <span className="sun-text">{s.suffix}</span>
            </p>
            <p className="mt-3 text-sm text-muted md:text-base">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
