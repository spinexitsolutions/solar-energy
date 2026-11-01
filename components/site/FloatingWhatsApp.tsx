"use client";
import { motion } from "motion/react";
import { useIntroDone } from "./Intro";

export default function FloatingWhatsApp({ number }: { number: string }) {
  const done = useIntroDone();
  if (!number) return null;
  return (
    <motion.a
      href={`https://wa.me/${number}?text=${encodeURIComponent("Hi! I'd like to know more about rooftop solar.")}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={done ? { scale: 1, opacity: 1 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20, delay: 1.2 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)]"
    >
      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.03c-.24.68-1.42 1.31-1.96 1.36-.5.05-.97.24-3.28-.68-2.78-1.1-4.55-3.95-4.69-4.13-.13-.18-1.12-1.49-1.12-2.85 0-1.35.71-2.02.96-2.29.25-.28.55-.35.73-.35l.53.01c.17.01.4-.06.62.48.24.56.8 1.94.87 2.08.07.14.12.3.02.48-.09.18-.14.3-.28.46l-.41.48c-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.16-.19.69-.81.88-1.09.18-.28.37-.23.62-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.68-.17 1.36Z" />
      </svg>
    </motion.a>
  );
}
