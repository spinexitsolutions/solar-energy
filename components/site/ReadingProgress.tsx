"use client";
import { motion, useScroll, useSpring } from "motion/react";
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return <motion.div style={{ scaleX: x }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left sun-bg" />;
}
