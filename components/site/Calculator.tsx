"use client";
import { animate, AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowUpRight, Building2, Factory, House, Check, Loader2 } from "lucide-react";
import type { CalculatorConfig } from "@/lib/types";
import { calculate, inr, inrShort, type PropertyKind } from "@/lib/calc";
import { submitLead } from "@/lib/actions";
import { SectionLabel, SplitReveal } from "./Reveal";

function Num({ value, format }: { value: number; format: (n: number) => string }) {
  const [v, setV] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const c = animate(prev.current, value, { duration: 0.6, ease: [0.22, 1, 0.36, 1], onUpdate: setV });
    prev.current = value;
    return () => c.stop();
  }, [value]);
  return <span className="tabular-nums">{format(v)}</span>;
}

const KINDS: { id: PropertyKind; label: string; icon: typeof House }[] = [
  { id: "home", label: "Home", icon: House },
  { id: "society", label: "Society", icon: Building2 },
  { id: "business", label: "Business", icon: Factory },
];

function SunArc({ pct }: { pct: number }) {
  const angle = Math.PI * (1 - pct / 100);
  const cx = 150 + 120 * Math.cos(angle);
  const cy = 150 - 120 * Math.sin(angle);
  return (
    <svg viewBox="0 0 300 170" className="w-full">
      <defs>
        <linearGradient id="arcG" x1="0" x2="1">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent-2)" />
        </linearGradient>
        <radialGradient id="sunG">
          <stop offset="0%" stopColor="#fff7e0" />
          <stop offset="60%" stopColor="var(--accent-2)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </radialGradient>
      </defs>
      <path d="M30 150 A120 120 0 0 1 270 150" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="3 6" />
      <motion.path
        d="M30 150 A120 120 0 0 1 270 150"
        fill="none"
        stroke="url(#arcG)"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ pathLength: pct / 100 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <line x1="10" x2="290" y1="150" y2="150" stroke="white" strokeOpacity="0.15" />
      <motion.circle
        r="13"
        fill="url(#sunG)"
        cx={cx}
        cy={cy}
        initial={false}
        animate={{ cx, cy }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ filter: "drop-shadow(0 0 14px var(--accent))" }}
      />
    </svg>
  );
}

export default function Calculator({ config, standalone = false }: { config: CalculatorConfig; standalone?: boolean }) {
  const [bill, setBill] = useState(4500);
  const [kind, setKind] = useState<PropertyKind>("home");
  const r = useMemo(() => calculate(bill, kind, config), [bill, kind, config]);
  const max = kind === "home" ? 30000 : 300000;
  const p = Math.min(100, (bill / max) * 100);

  const [step, setStep] = useState<"idle" | "form" | "done">("idle");
  const [pending, start] = useTransition();
  const [err, setErr] = useState("");

  useEffect(() => {
    setBill((b) => Math.min(b, max));
  }, [max]);

  const onSubmit = (fd: FormData) => {
    setErr("");
    start(async () => {
      const res = await submitLead({
        name: String(fd.get("name")),
        phone: String(fd.get("phone")),
        city: String(fd.get("city") ?? ""),
        monthlyBill: bill,
        systemSize: `${r.kw} kW`,
        propertyType: kind === "home" ? "Independent House" : kind === "society" ? "Housing Society" : "Commercial",
        source: "Calculator",
        message: `Calculator estimate: ${r.kw} kW, net cost ${inr(r.net)}, payback ${r.payback.toFixed(1)} yrs`,
      });
      if (res.ok) setStep("done");
      else setErr(res.error);
    });
  };

  return (
    <section id="calculator" className={`container-x ${standalone ? "pb-24" : "py-20 md:py-32"}`}>
      {!standalone && (
        <div className="mb-10 grid gap-6 md:mb-14 md:grid-cols-2 md:items-end">
          <div>
            <SectionLabel index="02">Savings calculator</SectionLabel>
            <h2 className="display mt-6 text-[3.6rem] md:text-[7.5rem]">
              <SplitReveal text="See what the" />
              <br />
              <SplitReveal text="sun owes you." delay={0.15} wordClassName={(w) => (w === "owes" || w === "you." ? "sun-text" : "")} />
            </h2>
          </div>
          <p className="max-w-md text-lg text-muted md:justify-self-end">
            Drag the slider to your average monthly bill. Estimates update instantly — including government subsidy.
          </p>
        </div>
      )}

      <div data-nav="dark" className="relative overflow-hidden rounded-[4px] bg-night text-white md:rounded-[4px]">
        <div
          className="pointer-events-none absolute -top-1/2 left-1/2 h-[120%] w-[120%] -translate-x-1/2 opacity-40 blur-3xl"
          style={{ background: "radial-gradient(40% 40% at 50% 50%, var(--accent), transparent)" }}
        />
        <div className="relative grid gap-10 p-6 md:grid-cols-[1.05fr_1fr] md:gap-16 md:p-14">
          {/* inputs */}
          <div>
            <div className="inline-flex rounded-full bg-white/[0.07] p-1">
              {KINDS.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setKind(k.id)}
                  className="relative flex items-center gap-2 rounded-full px-4 py-2.5 text-sm"
                >
                  {kind === k.id && (
                    <motion.span layoutId="kind-pill" className="absolute inset-0 rounded-full bg-white" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
                  )}
                  <k.icon className={`relative h-4 w-4 ${kind === k.id ? "text-ink" : "text-white/60"}`} />
                  <span className={`relative ${kind === k.id ? "text-ink" : "text-white/70"}`}>{k.label}</span>
                </button>
              ))}
            </div>

            <p className="eyebrow mt-10 text-white/50">Average monthly electricity bill</p>
            <p className="display-n mt-2 text-[4.6rem] leading-none md:text-[8.5rem]">
              <Num value={bill} format={inr} />
            </p>
            <input
              type="range"
              min={500}
              max={max}
              step={kind === "home" ? 100 : 1000}
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="range mt-8"
              style={{ ["--p" as string]: `${p}%` }}
              aria-label="Monthly electricity bill"
            />
            <div className="mt-3 flex justify-between font-mono text-xs text-white/40">
              <span>₹500</span>
              <span>{inrShort(max)}</span>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-2 md:gap-3">
              {[
                ["System", `${r.kw} kW`],
                ["Panels", `${r.panels}`],
                ["Roof area", `${r.area} ft²`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[4px] bg-white/[0.06] p-3 ring-1 ring-white/10 md:p-4">
                  <p className="text-[11px] text-white/50 md:text-xs">{k}</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight md:text-2xl">{v}</p>
                </div>
              ))}
            </div>
          </div>

          {/* results */}
          <div className="rounded-[4px] bg-white/[0.05] p-5 ring-1 ring-white/10 md:p-8">
            <div className="relative">
              <SunArc pct={r.offset} />
              <div className="absolute inset-x-0 bottom-0 text-center">
                <p className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                  <Num value={r.offset} format={(n) => `${Math.round(n)}%`} />
                </p>
                <p className="text-xs text-white/50">of your bill covered by sunlight</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[4px] bg-white/10">
              {[
                ["Monthly savings", <Num key="a" value={r.monthlySaving} format={inr} />],
                ["Payback", <Num key="b" value={r.payback} format={(n) => `${n.toFixed(1)} yrs`} />],
                ["Net cost", <Num key="c" value={r.net} format={inrShort} />],
                ["Subsidy", <Num key="d" value={r.subsidy} format={inrShort} />],
              ].map(([k, v], i) => (
                <div key={i} className="bg-night/60 p-4">
                  <p className="text-xs text-white/50">{k}</p>
                  <p className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-[4px] sun-bg p-4 text-[#1a0d00]">
              <div>
                <p className="text-xs font-medium opacity-70">25-year savings</p>
                <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                  <Num value={r.lifetime} format={inrShort} />
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-medium opacity-70">CO₂ avoided / yr</p>
                <p className="text-xl font-semibold">{r.co2.toFixed(1)} t</p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === "idle" && (
                <motion.button
                  key="cta"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setStep("form")}
                  className="btn btn-white mt-4 w-full !py-4"
                >
                  Lock this estimate — free survey <ArrowUpRight className="h-4 w-4" />
                </motion.button>
              )}
              {step === "form" && (
                <motion.form
                  key="form"
                  action={onSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 grid gap-2"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input name="name" required placeholder="Your name" className="rounded-xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-sun" />
                    <input name="phone" required type="tel" placeholder="Phone" className="rounded-xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-sun" />
                  </div>
                  <input name="city" placeholder="City (optional)" className="rounded-xl bg-white/10 px-4 py-3 text-sm outline-none ring-1 ring-white/10 placeholder:text-white/40 focus:ring-sun" />
                  {err && <p className="text-xs text-red-300">{err}</p>}
                  <button disabled={pending} className="btn btn-sun w-full !py-3.5">
                    {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send my estimate"}
                  </button>
                </motion.form>
              )}
              {step === "done" && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-4 flex items-center gap-3 rounded-[4px] bg-emerald-500/15 p-4 text-emerald-200 ring-1 ring-emerald-400/30">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400 text-night"><Check className="h-4 w-4" strokeWidth={3} /></span>
                  <p className="text-sm">Got it! A solar advisor will call you within 2 working hours.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted">
        Estimates assume {config.unitsPerKw} units/kW/month and ₹{config.tariff}/unit. Final figures after a free site survey.
      </p>
    </section>
  );
}
