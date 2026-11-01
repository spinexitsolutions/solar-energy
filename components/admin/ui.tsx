"use client";
import { AnimatePresence, motion } from "motion/react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Check, X } from "lucide-react";

/* ---------------- toast ---------------- */
type Toast = { id: number; text: string; tone: "ok" | "err" };
const ToastCtx = createContext<(text: string, tone?: Toast["tone"]) => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: Toast["tone"] = "ok") => {
    const id = Date.now() + Math.random();
    setList((l) => [...l, { id, text, tone }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 2800);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[90] flex flex-col items-center gap-2 lg:bottom-6">
        <AnimatePresence>
          {list.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm text-white shadow-2xl"
            >
              <span className={`grid h-5 w-5 place-items-center rounded-full ${t.tone === "ok" ? "bg-emerald-500" : "bg-red-500"}`}>
                {t.tone === "ok" ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
              </span>
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------------- primitives ---------------- */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-white p-5 shadow-[0_1px_0_rgba(0,0,0,0.04)] ring-1 ring-black/[0.05] md:p-6 ${className}`}>{children}</div>;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm" aria-pressed={checked}>
      <span className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${checked ? "bg-emerald-500" : "bg-black/15"}`}>
        <motion.span
          className="absolute top-0.5 h-6 w-6 rounded-full bg-white shadow"
          animate={{ left: checked ? 22 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 32 }}
        />
      </span>
      {label && <span>{label}</span>}
    </button>
  );
}

export const STAGE_COLORS: Record<string, string> = {
  New: "bg-sky-100 text-sky-700",
  Contacted: "bg-violet-100 text-violet-700",
  "Site Survey": "bg-amber-100 text-amber-800",
  Proposal: "bg-orange-100 text-orange-700",
  Won: "bg-emerald-100 text-emerald-700",
  Lost: "bg-zinc-200 text-zinc-600",
};
export const STAGE_DOT: Record<string, string> = {
  New: "bg-sky-500",
  Contacted: "bg-violet-500",
  "Site Survey": "bg-amber-500",
  Proposal: "bg-orange-500",
  Won: "bg-emerald-500",
  Lost: "bg-zinc-400",
};
export const PRIORITY_COLORS: Record<string, string> = {
  High: "text-red-600 bg-red-50",
  Medium: "text-amber-700 bg-amber-50",
  Low: "text-zinc-600 bg-zinc-100",
};

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${className}`}>{children}</span>;
}

export const timeAgo = (iso: string) => {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};
