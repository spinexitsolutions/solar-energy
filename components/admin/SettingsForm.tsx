"use client";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, RotateCcw, Save } from "lucide-react";
import type { Settings } from "@/lib/types";
import type { Field } from "@/lib/cms-schema";
import { resetDemo, saveContent } from "@/lib/actions";
import { PageTitle } from "./AdminShell";
import { FieldGrid } from "./Fields";
import { Panel, useToast } from "./ui";

const GROUPS: { title: string; description: string; fields: Field[] }[] = [
  {
    title: "Brand",
    description: "Name and tagline used across the site, SEO titles and intro.",
    fields: [
      { key: "brandName", label: "Brand name", type: "text" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "footerNote", label: "Footer certifications", type: "text", span: 2 },
    ],
  },
  {
    title: "Contact",
    description: "Shown in the navbar menu, footer, contact page and WhatsApp button.",
    fields: [
      { key: "phone", label: "Phone", type: "text" },
      { key: "whatsapp", label: "WhatsApp number (country code, digits only)", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "hours", label: "Working hours", type: "text" },
      { key: "address", label: "Address", type: "textarea", span: 2 },
    ],
  },
  {
    title: "Social",
    description: "Leave empty to hide.",
    fields: [
      { key: "instagram", label: "Instagram", type: "text" },
      { key: "linkedin", label: "LinkedIn", type: "text" },
      { key: "youtube", label: "YouTube", type: "text" },
      { key: "x", label: "X / Twitter", type: "text" },
    ],
  },
];

const PRESETS = [
  ["Sunrise", "#ff7a1a", "#ffc23d"],
  ["Solar flare", "#ff4d2e", "#ffb341"],
  ["Golden hour", "#f59e0b", "#fde047"],
  ["Eco green", "#10b981", "#a3e635"],
  ["Sky", "#2563eb", "#38bdf8"],
  ["Ultraviolet", "#7c3aed", "#f472b6"],
];

export default function SettingsForm({ settings }: { settings: Settings }) {
  const [s, setS] = useState(settings);
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const dirty = JSON.stringify(s) !== JSON.stringify(settings);

  const save = () =>
    start(async () => {
      await saveContent("settings", s);
      toast("Settings saved");
      router.refresh();
    });

  return (
    <div>
      <PageTitle
        title="Settings"
        subtitle="Brand identity, colours and contact details."
        actions={
          <button onClick={save} disabled={!dirty || pending} className="btn btn-ink !px-5 !py-2.5 text-sm disabled:opacity-40">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save changes
          </button>
        }
      />
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel className="xl:col-span-2">
          <h2 className="font-semibold tracking-tight">Brand colours</h2>
          <p className="text-sm text-muted">The gradient used for buttons, highlights, the sun and all accents.</p>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <div
              className="relative flex h-44 items-end overflow-hidden rounded-3xl bg-night p-5 text-white"
              style={{ ["--accent" as string]: s.accent, ["--accent-2" as string]: s.accent2 }}
            >
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-80 blur-2xl" style={{ background: `radial-gradient(circle, ${s.accent2}, ${s.accent} 50%, transparent 70%)` }} />
              <div className="relative">
                <p className="text-3xl font-semibold tracking-[-0.04em]">Your roof, <span className="serif-i sun-text">a power plant.</span></p>
                <span className="btn btn-sun mt-3 !py-2 text-sm">Get a quote</span>
              </div>
            </div>
            <div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {PRESETS.map(([n, a, b]) => (
                  <button key={n} onClick={() => setS({ ...s, accent: a, accent2: b })} className="group text-center" title={n}>
                    <span className={`block h-12 rounded-2xl ring-2 transition ${s.accent === a && s.accent2 === b ? "ring-ink" : "ring-transparent group-hover:ring-black/20"}`} style={{ background: `linear-gradient(120deg, ${a}, ${b})` }} />
                    <span className="mt-1 block text-[11px] text-muted">{n}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <FieldGrid
                  fields={[
                    { key: "accent", label: "Primary", type: "color" },
                    { key: "accent2", label: "Secondary", type: "color" },
                  ]}
                  value={s as unknown as Record<string, unknown>}
                  onChange={(v) => setS(v as unknown as Settings)}
                />
              </div>
            </div>
          </div>
        </Panel>

        {GROUPS.map((g) => (
          <Panel key={g.title}>
            <h2 className="font-semibold tracking-tight">{g.title}</h2>
            <p className="mb-5 text-sm text-muted">{g.description}</p>
            <FieldGrid fields={g.fields} value={s as unknown as Record<string, unknown>} onChange={(v) => setS(v as unknown as Settings)} />
          </Panel>
        ))}

        <Panel className="!bg-red-50/60 !ring-red-100">
          <h2 className="font-semibold tracking-tight text-red-700">Reset demo data</h2>
          <p className="mt-1 text-sm text-red-700/70">Restores all content, blog posts and leads to the original demo state. This can’t be undone.</p>
          <button
            onClick={() => {
              if (!confirm("Reset everything to demo data?")) return;
              start(async () => {
                await resetDemo();
                toast("Demo data restored");
                router.refresh();
                location.reload();
              });
            }}
            className="btn mt-4 bg-white !px-4 !py-2.5 text-sm text-red-600 ring-1 ring-red-200 hover:bg-red-50"
          >
            <RotateCcw className="h-4 w-4" /> Reset everything
          </button>
        </Panel>
      </div>
    </div>
  );
}
