"use client";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Copy, ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";
import type { Field } from "@/lib/cms-schema";
import { ICON_OPTIONS } from "@/lib/cms-schema";
import { IMG } from "@/lib/seed";
import { Icon } from "@/components/site/Icon";
import { Toggle } from "./ui";

type Obj = Record<string, unknown>;

/** Downscale an uploaded image in the browser and return a compact data URL. */
async function fileToDataUrl(file: File, max = 1600): Promise<string> {
  const url = URL.createObjectURL(file);
  const img = await new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = url;
  });
  const scale = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  URL.revokeObjectURL(url);
  return c.toDataURL("image/jpeg", 0.82);
}

export function ImageField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [lib, setLib] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  return (
    <div className="rounded-2xl ring-1 ring-black/[0.08]">
      <div className="flex gap-3 p-2">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-paper-2">
          {value ? <img src={value} alt="" className="h-full w-full object-cover" /> : <ImagePlus className="absolute inset-0 m-auto h-5 w-5 text-muted" />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <input className="field !py-2 text-xs" value={value.startsWith("data:") ? "(uploaded image)" : value} onChange={(e) => onChange(e.target.value)} placeholder="https://images.unsplash.com/…" />
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => input.current?.click()} className="flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1.5 text-xs hover:bg-black/10">
              <Upload className="h-3 w-3" /> Upload
            </button>
            <button type="button" onClick={() => setLib((l) => !l)} className="flex items-center gap-1.5 rounded-full bg-black/[0.05] px-3 py-1.5 text-xs hover:bg-black/10">
              <ImagePlus className="h-3 w-3" /> Library
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="flex items-center gap-1 rounded-full px-2 py-1.5 text-xs text-muted hover:text-red-600">
                <X className="h-3 w-3" /> Clear
              </button>
            )}
          </div>
          <input
            ref={input}
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (f) onChange(await fileToDataUrl(f));
              e.target.value = "";
            }}
          />
        </div>
      </div>
      <AnimatePresence>
        {lib && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="grid grid-cols-4 gap-1.5 border-t border-black/[0.06] p-2 sm:grid-cols-6">
              {Object.values(IMG).map((src) => (
                <button
                  type="button"
                  key={src}
                  onClick={() => {
                    onChange(src);
                    setLib(false);
                  }}
                  className={`aspect-square overflow-hidden rounded-lg ring-2 ${value === src ? "ring-sun" : "ring-transparent hover:ring-black/20"}`}
                >
                  <img src={src.replace(/w=\d+/, "w=200")} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TagsField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [draft, setDraft] = useState("");
  const add = () => {
    if (!draft.trim()) return;
    onChange([...value, draft.trim()]);
    setDraft("");
  };
  return (
    <div className="rounded-2xl p-2 ring-1 ring-black/[0.08]">
      <div className="flex flex-wrap gap-1.5">
        {value.map((t, i) => (
          <span key={i} className="flex items-center gap-1 rounded-full bg-black/[0.05] py-1 pl-3 pr-1 text-xs">
            {t}
            <button type="button" onClick={() => onChange(value.filter((_, k) => k !== i))} className="grid h-5 w-5 place-items-center rounded-full hover:bg-black/10" aria-label={`Remove ${t}`}>
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className="field !py-2 text-sm"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="Type and press Enter"
        />
        <button type="button" onClick={add} className="btn btn-ghost !px-3 !py-2"><Plus className="h-4 w-4" /></button>
      </div>
    </div>
  );
}

export function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  switch (field.type) {
    case "textarea":
      return <textarea className="field min-h-28 leading-relaxed" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input type="number" step="any" className="field" value={Number(value ?? 0)} onChange={(e) => onChange(Number(e.target.value))} />;
    case "toggle":
      return <Toggle checked={!!value} onChange={onChange} label={value ? "On" : "Off"} />;
    case "image":
      return <ImageField value={String(value ?? "")} onChange={onChange} />;
    case "tags":
      return <TagsField value={(value as string[]) ?? []} onChange={onChange} />;
    case "color":
      return (
        <div className="flex items-center gap-2 rounded-2xl p-1.5 ring-1 ring-black/[0.08]">
          <input type="color" value={String(value)} onChange={(e) => onChange(e.target.value)} className="h-10 w-14 cursor-pointer rounded-xl border-0 bg-transparent" />
          <input className="field !border-0 !py-2 font-mono text-sm !shadow-none" value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case "select":
      return (
        <select className="field" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          {field.options?.map((o) => <option key={o}>{o}</option>)}
        </select>
      );
    case "icon":
      return (
        <div className="flex flex-wrap gap-1.5">
          {ICON_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              title={n}
              className={`grid h-10 w-10 place-items-center rounded-xl ring-1 transition ${value === n ? "bg-ink text-white ring-ink" : "ring-black/[0.08] hover:ring-black/25"}`}
            >
              <Icon name={n} className="h-4 w-4" />
            </button>
          ))}
        </div>
      );
    case "list":
      return (
        <ListEditor
          items={(value as Obj[]) ?? []}
          fields={field.fields ?? []}
          blank={field.blank ?? {}}
          itemTitle={field.itemTitle ?? field.fields?.[0]?.key ?? ""}
          onChange={onChange}
          compact
        />
      );
    default:
      return <input className="field" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function FieldGrid({ fields, value, onChange }: { fields: Field[]; value: Obj; onChange: (v: Obj) => void }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f.key} className={f.span === 2 || f.type === "image" || f.type === "list" ? "sm:col-span-2" : ""}>
          <label className="label">{f.label}</label>
          <FieldInput field={f} value={value[f.key]} onChange={(v) => onChange({ ...value, [f.key]: v })} />
          {f.help && <p className="mt-1 text-xs text-muted">{f.help}</p>}
        </div>
      ))}
    </div>
  );
}

export function ListEditor({
  items,
  fields,
  blank,
  itemTitle,
  itemSubtitle,
  onChange,
  compact = false,
}: {
  items: Obj[];
  fields: Field[];
  blank: Obj;
  itemTitle: string;
  itemSubtitle?: string;
  onChange: (v: Obj[]) => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(compact ? null : 0);
  const moveItem = (i: number, d: -1 | 1) => {
    const j = i + d;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };
  const withId = (o: Obj) => ("id" in blank || "id" in o ? { ...o, id: `${String(o.id ?? "item").replace(/-\w{4}$/, "")}-${Math.random().toString(36).slice(2, 6)}` } : o);

  return (
    <div className="space-y-2">
      {items.map((it, i) => {
        const on = open === i;
        const img = fields.find((f) => f.type === "image");
        return (
          <motion.div layout key={i} className={`overflow-hidden rounded-2xl ring-1 transition-colors ${on ? "bg-white ring-black/15" : "bg-white ring-black/[0.07]"}`}>
            <div className="flex items-center gap-3 p-2 pl-3">
              {img && it[img.key] ? <img src={String(it[img.key])} alt="" className="h-10 w-10 rounded-lg object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-lg bg-black/[0.04] font-mono text-xs text-muted">{i + 1}</span>}
              <button type="button" onClick={() => setOpen(on ? null : i)} className="min-w-0 flex-1 text-left">
                <span className="block truncate text-sm font-medium">{String(it[itemTitle] ?? "Untitled") || "Untitled"}</span>
                {itemSubtitle && <span className="block truncate text-xs text-muted">{String(it[itemSubtitle] ?? "")}</span>}
              </button>
              <div className="flex items-center">
                <button type="button" onClick={() => moveItem(i, -1)} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink" aria-label="Move up"><ChevronUp className="h-4 w-4" /></button>
                <button type="button" onClick={() => moveItem(i, 1)} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink" aria-label="Move down"><ChevronDown className="h-4 w-4" /></button>
                <button type="button" onClick={() => onChange([...items.slice(0, i + 1), withId(structuredClone(it)), ...items.slice(i + 1)])} className="hidden h-8 w-8 place-items-center rounded-full text-muted hover:bg-black/5 hover:text-ink sm:grid" aria-label="Duplicate"><Copy className="h-3.5 w-3.5" /></button>
                <button type="button" onClick={() => onChange(items.filter((_, k) => k !== i))} className="grid h-8 w-8 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600" aria-label="Delete"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                  <div className="border-t border-black/[0.06] p-4">
                    <FieldGrid fields={fields} value={it} onChange={(v) => onChange(items.map((x, k) => (k === i ? v : x)))} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
      <button
        type="button"
        onClick={() => {
          onChange([...items, withId(structuredClone(blank))]);
          setOpen(items.length);
        }}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-black/15 py-3 text-sm text-muted transition hover:border-black/30 hover:text-ink"
      >
        <Plus className="h-4 w-4" /> Add item
      </button>
    </div>
  );
}
