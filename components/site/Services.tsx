"use client";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Service } from "@/lib/types";
import { Icon } from "./Icon";
import { SectionLabel, SplitReveal } from "./Reveal";

function StackCard({
  s,
  i,
  total,
  progress,
}: {
  s: Service;
  i: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const targetScale = 1 - (total - i) * 0.035;
  const start = i / total;
  const scale = useTransform(progress, [start, 1], [1, targetScale]);
  const brightness = useTransform(progress, [start, Math.min(1, start + 0.35)], [1, i === total - 1 ? 1 : 0.7]);
  const filter = useTransform(brightness, (b) => `brightness(${b})`);

  return (
    <div id={s.id} className="sticky top-0 flex h-dvh items-center justify-center" style={{ paddingTop: `calc(5.5rem + ${i * 14}px)` }}>
      <motion.article
        style={{ scale, filter }}
        className="relative flex h-[min(76vh,640px)] w-full origin-top flex-col overflow-hidden rounded-[4px] bg-white shadow-[0_30px_80px_-40px_rgba(0,0,0,0.45)] ring-1 ring-ink/5 md:grid md:grid-cols-2 md:rounded-[4px]"
      >
        <div className="relative order-1 h-[40%] shrink-0 overflow-hidden md:order-2 md:h-full">
          <motion.img
            src={s.image}
            alt={s.title}
            className="h-full w-full object-cover"
            initial={{ scale: 1.2 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
          />
          <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 font-mono text-[11px] md:left-6 md:top-6">
            {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <div className="order-2 flex min-h-0 flex-1 flex-col justify-between p-6 md:order-1 md:p-12">
          <div>
            <span className="grid h-12 w-12 place-items-center rounded-[4px] bg-paper text-ink md:h-14 md:w-14">
              <Icon name={s.icon} className="h-6 w-6" />
            </span>
            <h3 className="display-n mt-5 text-[2.5rem] leading-[0.9] md:mt-8 md:text-[4.2rem]">{s.title}</h3>
            <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-muted md:mt-4 md:text-lg">{s.description}</p>
          </div>
          <div className="mt-4">
            <ul className="hidden space-y-2.5 sm:block">
              {s.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-[15px]">
                  <span className="grid h-5 w-5 place-items-center rounded-full sun-bg">
                    <Check className="h-3 w-3 text-[#1a0d00]" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link href={`/contact?service=${s.id}`} className="btn btn-ink mt-5 !py-3 text-sm md:mt-8">
              Enquire now <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function Services({ services, heading = true }: { services: Service[]; heading?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section className="relative pt-20 md:pt-32">
      {heading && (
        <div className="container-x">
          <SectionLabel index="01">Solutions</SectionLabel>
          <div className="mt-6 grid gap-6 md:grid-cols-2 md:items-end">
            <h2 className="display text-[3.6rem] md:text-[7.5rem]">
              <SplitReveal text="One partner." />
              <br />
              <SplitReveal text="Every watt." delay={0.15} wordClassName={() => "sun-text"} />
            </h2>
            <p className="max-w-md text-lg text-muted md:justify-self-end">
              From a 2 kW home rooftop to a multi-megawatt plant — design, approvals, installation and lifetime care under one roof.
            </p>
          </div>
        </div>
      )}
      <div ref={ref} className="container-x relative">
        {services.map((s, i) => (
          <StackCard key={s.id} s={s} i={i} total={services.length} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
