"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Building2, Check, Factory, House, Loader2, Store, Tractor } from "lucide-react";
import { submitLead } from "@/lib/actions";
import { inr } from "@/lib/calc";

const TYPES = [
  { id: "Independent House", icon: House },
  { id: "Housing Society", icon: Building2 },
  { id: "Commercial", icon: Store },
  { id: "Factory", icon: Factory },
  { id: "Farm / Agri", icon: Tractor },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function LeadForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState({
    propertyType: "Independent House",
    monthlyBill: 4000,
    city: "",
    name: "",
    phone: "",
    email: "",
    message: defaultMessage,
  });
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof data, v: string | number) => setData((d) => ({ ...d, [k]: v }));
  const go = (n: number) => {
    setDir(n > step ? 1 : -1);
    setStep(n);
  };

  const submit = () => {
    setError("");
    start(async () => {
      const r = await submitLead({ ...data, source: "Website" });
      if (r.ok) setDone(true);
      else setError(r.error);
    });
  };

  const steps = ["Property", "Usage", "Contact"];

  if (done)
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="card flex flex-col items-center p-10 text-center md:p-16">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}
          className="grid h-20 w-20 place-items-center rounded-full sun-bg"
        >
          <Check className="h-9 w-9 text-[#1a0d00]" strokeWidth={3} />
        </motion.span>
        <h3 className="mt-6 text-3xl font-semibold tracking-[-0.04em]">You’re on our radar, {data.name.split(" ")[0]}.</h3>
        <p className="mt-3 max-w-sm text-muted">A solar advisor will call you within 2 working hours to schedule your free site survey.</p>
      </motion.div>
    );

  return (
    <div className="card overflow-hidden p-6 md:p-10">
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className="h-1 overflow-hidden rounded-full bg-ink/[0.07]">
              <motion.div className="h-full sun-bg" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.6, ease }} />
            </div>
            <p className={`mt-2 text-xs ${i <= step ? "text-ink" : "text-muted"}`}>{`0${i + 1} ${s}`}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-8 min-h-[330px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.45, ease }}
          >
            {step === 0 && (
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">What are we powering?</h3>
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {TYPES.map((t) => {
                    const on = data.propertyType === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => set("propertyType", t.id)}
                        className={`relative flex flex-col items-start gap-6 rounded-[4px] p-4 text-left ring-1 transition ${
                          on ? "bg-night text-white ring-night" : "bg-paper ring-ink/5 hover:ring-ink/20"
                        }`}
                      >
                        <t.icon className={`h-6 w-6 ${on ? "text-sun-2" : ""}`} strokeWidth={1.6} />
                        <span className="text-sm font-medium">{t.id}</span>
                        {on && <span className="absolute right-3 top-3 h-2 w-2 rounded-full sun-bg" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Your average monthly bill?</h3>
                <p className="mt-8 text-6xl font-semibold tracking-[-0.05em]">{inr(data.monthlyBill)}</p>
                <input
                  type="range"
                  min={500}
                  max={data.propertyType === "Independent House" ? 30000 : 300000}
                  step={data.propertyType === "Independent House" ? 100 : 1000}
                  value={data.monthlyBill}
                  onChange={(e) => set("monthlyBill", Number(e.target.value))}
                  className="range mt-6"
                  style={{
                    ["--p" as string]: `${(data.monthlyBill / (data.propertyType === "Independent House" ? 30000 : 300000)) * 100}%`,
                    background: `linear-gradient(90deg, var(--accent), var(--accent-2) ${(data.monthlyBill / (data.propertyType === "Independent House" ? 30000 : 300000)) * 100}%, rgba(12,12,13,0.08) 0)`,
                  }}
                />
                <label className="label mt-8">City</label>
                <input className="field" value={data.city} onChange={(e) => set("city", e.target.value)} placeholder="e.g. Pune" />
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-3">
                <h3 className="mb-3 text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Where should we send your design?</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="label">Full name *</label>
                    <input className="field" value={data.name} onChange={(e) => set("name", e.target.value)} placeholder="Aditi Sharma" />
                  </div>
                  <div>
                    <label className="label">Phone *</label>
                    <input className="field" type="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98xxx xxxxx" />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input className="field" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
                </div>
                <div>
                  <label className="label">Anything else?</label>
                  <textarea className="field min-h-24" value={data.message} onChange={(e) => set("message", e.target.value)} placeholder="Roof type, preferred time to call…" />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" onClick={() => go(step - 1)} disabled={step === 0} className="btn btn-ghost !px-4 disabled:opacity-0">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {step < 2 ? (
          <button type="button" onClick={() => go(step + 1)} className="btn btn-ink !px-6">
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={submit} disabled={pending} className="btn btn-sun !px-6">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Get my free quote <ArrowRight className="h-4 w-4" /></>}
          </button>
        )}
      </div>
    </div>
  );
}
