"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpDown, Columns3, Download, Mail, MessageCircle, Phone, Plus, Search, Rows3, Trash2, X, Send, MapPin, Zap,
} from "lucide-react";
import type { Lead, LeadStage } from "@/lib/types";
import { LEAD_STAGES } from "@/lib/types";
import { addLeadNote, createLead, deleteLead, updateLead } from "@/lib/actions";
import { inr, inrShort } from "@/lib/calc";
import { PageTitle } from "./AdminShell";
import { Badge, PRIORITY_COLORS, STAGE_COLORS, STAGE_DOT, timeAgo, useToast } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;
const initials = (n: string) => n.split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

export default function LeadsCRM({ initial, openId }: { initial: Lead[]; openId?: string }) {
  const router = useRouter();
  const toast = useToast();
  const [leads, setLeads] = useState(initial);
  const [view, setView] = useState<"board" | "table">("board");
  const [q, setQ] = useState("");
  const [source, setSource] = useState("All");
  const [priority, setPriority] = useState("All");
  const [openLead, setOpenLead] = useState<string | null>(openId ?? null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStage | null>(null);
  const [sort, setSort] = useState<{ key: keyof Lead; dir: 1 | -1 }>({ key: "createdAt", dir: -1 });
  const [, start] = useTransition();

  useEffect(() => setLeads(initial), [initial]);

  const sources = useMemo(() => ["All", ...Array.from(new Set(initial.map((l) => l.source)))], [initial]);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    return leads
      .filter((l) => source === "All" || l.source === source)
      .filter((l) => priority === "All" || l.priority === priority)
      .filter((l) => !t || [l.name, l.phone, l.email, l.city, l.id].join(" ").toLowerCase().includes(t))
      .sort((a, b) => {
        const x = a[sort.key] as string | number;
        const y = b[sort.key] as string | number;
        return (x > y ? 1 : x < y ? -1 : 0) * sort.dir;
      });
  }, [leads, q, source, priority, sort]);

  const patch = (id: string, p: Partial<Lead>) => {
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));
    start(async () => {
      await updateLead(id, p);
      router.refresh();
    });
  };

  const move = (id: string, stage: LeadStage) => {
    const l = leads.find((x) => x.id === id);
    if (!l || l.stage === stage) return;
    patch(id, { stage });
    toast(`${l.name} → ${stage}`);
  };

  const remove = (id: string) => {
    if (!confirm("Delete this lead permanently?")) return;
    setLeads((ls) => ls.filter((l) => l.id !== id));
    setOpenLead(null);
    start(async () => {
      await deleteLead(id);
      toast("Lead deleted");
      router.refresh();
    });
  };

  const add = () => {
    start(async () => {
      const l = await createLead({ name: "New lead", source: "Manual" });
      setLeads((ls) => [l, ...ls]);
      setOpenLead(l.id);
      router.refresh();
    });
  };

  const exportCsv = () => {
    const cols: (keyof Lead)[] = ["id", "name", "phone", "email", "city", "propertyType", "monthlyBill", "systemSize", "stage", "value", "priority", "source", "followUp", "createdAt", "message"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...filtered.map((l) => cols.map((c) => esc(l[c])).join(","))].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const current = leads.find((l) => l.id === openLead) ?? null;
  const totalOpen = filtered.filter((l) => l.stage !== "Won" && l.stage !== "Lost").reduce((s, l) => s + l.value, 0);

  return (
    <div>
      <PageTitle
        title="CRM"
        subtitle={`${filtered.length} leads · ${inrShort(totalOpen)} open pipeline`}
        actions={
          <>
            <button onClick={exportCsv} className="btn bg-white !px-4 !py-2.5 text-sm ring-1 ring-black/[0.07]"><Download className="h-4 w-4" /> Export</button>
            <button onClick={add} className="btn btn-ink !px-4 !py-2.5 text-sm"><Plus className="h-4 w-4" /> Add lead</button>
          </>
        }
      />

      {/* toolbar */}
      <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, city, ID…" className="field !rounded-full !py-2.5 !pl-10" />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <select value={source} onChange={(e) => setSource(e.target.value)} className="field !w-auto !rounded-full !py-2.5">
            {sources.map((s) => <option key={s}>{s === "All" ? "All sources" : s}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="field !w-auto !rounded-full !py-2.5">
            {["All", "High", "Medium", "Low"].map((s) => <option key={s} value={s}>{s === "All" ? "Any priority" : s}</option>)}
          </select>
          <div className="flex shrink-0 rounded-full bg-white p-1 ring-1 ring-black/[0.07]">
            {([["board", Columns3], ["table", Rows3]] as const).map(([v, I]) => (
              <button key={v} onClick={() => setView(v)} className="relative grid h-9 w-10 place-items-center rounded-full" aria-label={`${v} view`}>
                {view === v && <motion.span layoutId="crm-view" className="absolute inset-0 rounded-full bg-ink" />}
                <I className={`relative h-4 w-4 ${view === v ? "text-white" : "text-muted"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "board" ? (
        <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
          {LEAD_STAGES.map((stage) => {
            const list = filtered.filter((l) => l.stage === stage);
            return (
              <div
                key={stage}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverStage(stage);
                }}
                onDragLeave={() => setOverStage((s) => (s === stage ? null : s))}
                onDrop={() => {
                  if (dragId) move(dragId, stage);
                  setDragId(null);
                  setOverStage(null);
                }}
                className={`flex w-[82vw] shrink-0 snap-start flex-col rounded-3xl p-2 transition-colors sm:w-72 ${overStage === stage ? "bg-black/[0.07] ring-2 ring-sun/50" : "bg-black/[0.035]"}`}
              >
                <div className="flex items-center justify-between px-2 pb-2 pt-1.5">
                  <span className="flex items-center gap-2 text-sm font-medium">
                    <span className={`h-2 w-2 rounded-full ${STAGE_DOT[stage]}`} /> {stage}
                    <span className="rounded-full bg-white px-1.5 text-xs text-muted">{list.length}</span>
                  </span>
                  <span className="text-xs text-muted">{inrShort(list.reduce((s, l) => s + l.value, 0))}</span>
                </div>
                <div className="flex min-h-24 flex-col gap-2">
                  <AnimatePresence initial={false}>
                    {list.map((l) => (
                      <motion.button
                        layout
                        layoutId={l.id}
                        key={l.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: dragId === l.id ? 0.4 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, ease }}
                        draggable
                        onDragStartCapture={() => setDragId(l.id)}
                        onDragEndCapture={() => setDragId(null)}
                        onClick={() => setOpenLead(l.id)}
                        className="cursor-grab rounded-2xl bg-white p-3.5 text-left shadow-[0_1px_2px_rgba(0,0,0,0.05)] ring-1 ring-black/[0.05] transition hover:shadow-md active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-medium leading-tight">{l.name}</span>
                          <Badge className={PRIORITY_COLORS[l.priority]}>{l.priority}</Badge>
                        </div>
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted"><MapPin className="h-3 w-3" />{l.city || "—"} · {l.propertyType}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm font-semibold">{inrShort(l.value)}</span>
                          <span className="flex items-center gap-1 text-[11px] text-muted">
                            {l.systemSize && <><Zap className="h-3 w-3" />{l.systemSize} ·</>} {timeAgo(l.createdAt)}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </AnimatePresence>
                  {list.length === 0 && <p className="py-6 text-center text-xs text-muted">Drop leads here</p>}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-black/[0.05]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="border-b border-black/[0.06] text-left text-xs text-muted">
                <tr>
                  {([
                    ["name", "Lead"],
                    ["city", "City"],
                    ["source", "Source"],
                    ["monthlyBill", "Bill / mo"],
                    ["value", "Deal value"],
                    ["stage", "Stage"],
                    ["priority", "Priority"],
                    ["createdAt", "Created"],
                  ] as [keyof Lead, string][]).map(([k, label]) => (
                    <th key={k} className="px-4 py-3 font-medium">
                      <button onClick={() => setSort((s) => ({ key: k, dir: s.key === k ? (s.dir === 1 ? -1 : 1) : 1 }))} className="flex items-center gap-1 hover:text-ink">
                        {label} <ArrowUpDown className={`h-3 w-3 ${sort.key === k ? "text-ink" : "opacity-40"}`} />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04]">
                {filtered.map((l) => (
                  <tr key={l.id} onClick={() => setOpenLead(l.id)} className="cursor-pointer transition hover:bg-black/[0.02]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-full bg-paper text-xs font-semibold">{initials(l.name)}</span>
                        <div>
                          <p className="font-medium">{l.name}</p>
                          <p className="text-xs text-muted">{l.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">{l.city || "—"}</td>
                    <td className="px-4 py-3">{l.source}</td>
                    <td className="px-4 py-3">{inr(l.monthlyBill)}</td>
                    <td className="px-4 py-3 font-medium">{inrShort(l.value)}</td>
                    <td className="px-4 py-3"><Badge className={STAGE_COLORS[l.stage]}>{l.stage}</Badge></td>
                    <td className="px-4 py-3"><Badge className={PRIORITY_COLORS[l.priority]}>{l.priority}</Badge></td>
                    <td className="px-4 py-3 text-muted">{timeAgo(l.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="p-10 text-center text-muted">No leads match your filters.</p>}
          </div>
        </div>
      )}

      <AnimatePresence>
        {current && <LeadDrawer key={current.id} lead={current} onClose={() => setOpenLead(null)} onPatch={(p) => patch(current.id, p)} onDelete={() => remove(current.id)} onNote={(n) => setLeads((ls) => ls.map((l) => (l.id === current.id ? { ...l, notes: [n, ...l.notes] } : l)))} />}
      </AnimatePresence>
    </div>
  );
}

function LeadDrawer({
  lead,
  onClose,
  onPatch,
  onDelete,
  onNote,
}: {
  lead: Lead;
  onClose: () => void;
  onPatch: (p: Partial<Lead>) => void;
  onDelete: () => void;
  onNote: (n: Lead["notes"][number]) => void;
}) {
  const [form, setForm] = useState(lead);
  const [note, setNote] = useState("");
  const [pending, start] = useTransition();
  const toast = useToast();
  const router = useRouter();
  const dirty = JSON.stringify({ ...form, notes: [] }) !== JSON.stringify({ ...lead, notes: [] });
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = () => {
    const { notes: _n, id: _i, createdAt: _c, ...rest } = form;
    onPatch(rest);
    toast("Lead saved");
  };

  const sendNote = () => {
    if (!note.trim()) return;
    start(async () => {
      const r = await addLeadNote(lead.id, note);
      if (r.ok && r.note) {
        onNote(r.note);
        setNote("");
        router.refresh();
      }
    });
  };

  const phone = form.phone.replace(/[^\d+]/g, "");
  const field = (k: keyof Lead, label: string, type = "text") => (
    <div>
      <label className="label">{label}</label>
      <input
        type={type}
        className="field"
        value={String(form[k] ?? "")}
        onChange={(e) => set(k, (type === "number" ? Number(e.target.value) : e.target.value) as never)}
      />
    </div>
  );

  return (
    <>
      <motion.div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease }}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col bg-[#f5f5f7] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black/[0.06] bg-white px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full sun-bg font-semibold text-[#1a0d00]">{initials(form.name)}</span>
            <div>
              <p className="font-semibold leading-tight">{form.name}</p>
              <p className="text-xs text-muted">{lead.id} · created {timeAgo(lead.createdAt)} via {lead.source}</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5" data-lenis-prevent>
          <div className="grid grid-cols-3 gap-2">
            <a href={`tel:${phone}`} className="btn bg-white !py-3 text-sm ring-1 ring-black/[0.06]"><Phone className="h-4 w-4" /> Call</a>
            <a href={`https://wa.me/${phone.replace("+", "")}`} target="_blank" rel="noreferrer" className="btn bg-white !py-3 text-sm ring-1 ring-black/[0.06]"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <a href={`mailto:${form.email}`} className="btn bg-white !py-3 text-sm ring-1 ring-black/[0.06]"><Mail className="h-4 w-4" /> Email</a>
          </div>

          <div>
            <p className="label">Stage</p>
            <div className="flex flex-wrap gap-1.5">
              {LEAD_STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    set("stage", s);
                    onPatch({ stage: s });
                  }}
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${form.stage === s ? "bg-ink text-white ring-ink" : "bg-white ring-black/[0.08] hover:ring-black/20"}`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${STAGE_DOT[s]}`} />{s}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 rounded-3xl bg-white p-4 ring-1 ring-black/[0.05]">
            <div className="col-span-2">{field("name", "Full name")}</div>
            {field("phone", "Phone")}
            {field("email", "Email", "email")}
            {field("city", "City")}
            <div>
              <label className="label">Property</label>
              <select className="field" value={form.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
                {["Independent House", "Apartment", "Villa", "Housing Society", "Commercial", "Factory", "Farm / Agri"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            {field("monthlyBill", "Monthly bill (₹)", "number")}
            {field("systemSize", "System size")}
            {field("value", "Deal value (₹)", "number")}
            <div>
              <label className="label">Priority</label>
              <select className="field" value={form.priority} onChange={(e) => set("priority", e.target.value as Lead["priority"])}>
                {["High", "Medium", "Low"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            {field("followUp", "Follow-up date", "date")}
            {field("source", "Source")}
            <div className="col-span-2">
              <label className="label">Customer message</label>
              <textarea className="field min-h-20" value={form.message} onChange={(e) => set("message", e.target.value)} />
            </div>
          </div>

          <div className="rounded-3xl bg-white p-4 ring-1 ring-black/[0.05]">
            <p className="font-medium">Activity & notes</p>
            <div className="mt-3 flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendNote()}
                className="field"
                placeholder="Log a call, meeting or note…"
              />
              <button onClick={sendNote} disabled={pending || !note.trim()} className="btn btn-ink !px-4 disabled:opacity-40" aria-label="Add note"><Send className="h-4 w-4" /></button>
            </div>
            <ol className="relative mt-4 space-y-4 border-l border-black/[0.08] pl-4">
              {lead.notes.map((n) => (
                <li key={n.id} className="relative">
                  <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full sun-bg ring-4 ring-white" />
                  <p className="text-sm">{n.text}</p>
                  <p className="mt-0.5 text-xs text-muted">{timeAgo(n.at)}</p>
                </li>
              ))}
              <li className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 rounded-full bg-black/20 ring-4 ring-white" />
                <p className="text-sm text-muted">Lead created via {lead.source}</p>
                <p className="mt-0.5 text-xs text-muted">{new Date(lead.createdAt).toLocaleString("en-IN")}</p>
              </li>
            </ol>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 border-t border-black/[0.06] bg-white p-4">
          <button onClick={onDelete} className="btn !px-4 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /> Delete</button>
          <button onClick={save} disabled={!dirty} className="btn btn-ink !px-6 text-sm disabled:opacity-40">Save changes</button>
        </div>
      </motion.aside>
    </>
  );
}
