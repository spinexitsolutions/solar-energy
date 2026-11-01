"use client";
import { motion } from "motion/react";
import { SectionLabel, SplitReveal } from "./Reveal";
import { useIntroDone } from "./Intro";

export default function PageHeader({
  label,
  title,
  highlight,
  subtitle,
  image,
}: {
  label: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  image?: string;
}) {
  const done = useIntroDone();
  return (
    <section className="relative pt-32 md:pt-44">
      <div className="container-x">
        <SectionLabel>{label}</SectionLabel>
        {done && (
          <h1 className="display mt-6 max-w-6xl text-[17vw] md:text-[9.5rem]">
            <SplitReveal text={title} />{" "}
            {highlight && <SplitReveal text={highlight} delay={0.15} wordClassName={() => "sun-text"} />}
          </h1>
        )}
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={done ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-6 max-w-2xl text-lg text-muted md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
      {image && (
        <motion.div
          initial={{ clipPath: "inset(20% 10% 0% 10% round 40px)", opacity: 0 }}
          animate={done ? { clipPath: "inset(0% 0% 0% 0% round 32px)", opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          className="container-x mt-12 md:mt-16"
        >
          <img src={image} alt="" className="h-[50vh] w-full rounded-[4px] object-cover md:h-[70vh]" />
        </motion.div>
      )}
    </section>
  );
}
