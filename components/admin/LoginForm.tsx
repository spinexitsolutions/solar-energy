"use client";
import { useActionState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Loader2 } from "lucide-react";
import { login } from "@/lib/actions";

export default function LoginForm({ brand, demoEmail }: { brand: string; demoEmail?: string }) {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <motion.form
      action={action}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-sm"
    >
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-night">
        <span className="h-5 w-5 rounded-full sun-bg animate-pulse-sun" />
      </span>
      <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em]">Sign in to {brand}</h1>
      <p className="mt-2 text-muted">Admin, CRM & content studio.</p>

      <div className="mt-8 space-y-3">
        <div>
          <label className="label">Email</label>
          <input name="email" type="email" required defaultValue={demoEmail} className="field !py-3" />
        </div>
        <div>
          <label className="label">Password</label>
          <input name="password" type="password" required className="field !py-3" placeholder="••••••••" />
        </div>
        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button disabled={pending} className="btn btn-ink mt-2 w-full !py-3.5">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      {demoEmail && (
        <p className="mt-6 rounded-2xl bg-amber-50 p-4 text-xs text-amber-900 ring-1 ring-amber-200">
          Demo credentials — <b>{demoEmail}</b> / <b>lumora@2026</b>. Set <code>ADMIN_EMAIL</code> & <code>ADMIN_PASSWORD</code> in <code>.env.local</code> for production.
        </p>
      )}
    </motion.form>
  );
}
