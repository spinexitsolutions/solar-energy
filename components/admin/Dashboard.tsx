"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, CalendarClock, IndianRupee, Phone, Target, TrendingUp, Users } from "lucide-react";
import type { Lead } from "@/lib/types";
import { LEAD_STAGES } from "@/lib/types";
import { inrShort } from "@/lib/calc";
import { Badge, Panel, STAGE_COLORS, STAGE_DOT, timeAgo } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

export default function Dashboard({
  leads,
  counts,
  name,
}: {
  leads: Lead[];
  counts: { posts: number; projects: number; services: number; testimonials: number };
  name: string;
}) {
  const now = Date.now();
  const week = leads.filter((l) => now - +new Date(l.createdAt) < 7 * 864e5);
  const won = leads.filter((l) => l.stage === "Won");
  const lost = leads.filter((l) => l.stage === "Lost");
  const open = leads.filter((l) => l.stage !== "Won" && l.stage !== "Lost");
  const pipeline = open.reduce((s, l) => s + l.value, 0);
  const revenue = won.reduce((s, l) => s + l.value, 0);
  const conv = won.length + lost.length ? Math.round((won.length / (won.length + lost.length)) * 100) : 0;

  // last 14 days
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (13 - i));
    const next = +d + 864e5;
    return { d, n: leads.filter((l) => +new Date(l.createdAt) >= +d && +new Date(l.createdAt) < next).length };
  });
  const maxDay = Math.max(1, ...days.map((x) => x.n));

  const sources = Object.entries(
    leads.reduce<Record<string, number>>((a, l) => ((a[l.source] = (a[l.source] ?? 0) + 1), a), {})
  ).sort((a, b) => b[1] - a[1]);

  const followUps = open
    .filter((l) => l.followUp)
    .sort((a, b) => a.followUp.localeCompare(b.followUp))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const kpis = [
    { label: "New leads · 7d", value: String(week.length), icon: Users, hint: `${leads.length} total` },
    { label: "Open pipeline", value: inrShort(pipeline), icon: TrendingUp, hint: `${open.length} deals` },
    { label: "Won revenue", value: inrShort(revenue), icon: IndianRupee, hint: `${won.length} closed` },
    { label: "Win rate", value: `${conv}%`, icon: Target, hint: `${lost.length} lost` },
  ];

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm text-muted">{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
          {greet}, <span className="sun-text">{name}.</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {kpis.map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: i * 0.06 }}>
            <Panel className={i === 1 ? "!bg-night text-white !ring-0" : ""}>
              <div className="flex items-center justify-between">
                <p className={`text-xs md:text-sm ${i === 1 ? "text-white/60" : "text-muted"}`}>{k.label}</p>
                <k.icon className={`h-4 w-4 ${i === 1 ? "text-sun-2" : "text-muted"}`} />
              </div>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] md:text-4xl">{k.value}</p>
              <p className={`mt-1 text-xs ${i === 1 ? "text-white/50" : "text-muted"}`}>{k.hint}</p>
            </Panel>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold tracking-tight">Lead inflow</h2>
            <span className="text-xs text-muted">Last 14 days</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-1.5 md:gap-2.5">
            {days.map((x, i) => (
              <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex h-40 w-full items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(4, (x.n / maxDay) * 100)}%` }}
                    transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.03 }}
                    className={`w-full rounded-lg ${x.n ? "sun-bg" : "bg-black/[0.06]"}`}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] text-white opacity-0 transition group-hover:opacity-100">{x.n}</span>
                </div>
                <span className="text-[10px] text-muted">{x.d.getDate()}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <h2 className="font-semibold tracking-tight">Pipeline funnel</h2>
          <div className="mt-5 space-y-3">
            {LEAD_STAGES.map((s, i) => {
              const list = leads.filter((l) => l.stage === s);
              const pct = leads.length ? (list.length / leads.length) * 100 : 0;
              return (
                <div key={s}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${STAGE_DOT[s]}`} />{s}</span>
                    <span className="text-muted">{list.length} · {inrShort(list.reduce((a, l) => a + l.value, 0))}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/[0.05]">
                    <motion.div className={`h-full rounded-full ${STAGE_DOT[s]}`} initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.9, ease, delay: 0.2 + i * 0.05 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2 !p-0">
          <div className="flex items-center justify-between p-5 pb-3 md:p-6 md:pb-3">
            <h2 className="font-semibold tracking-tight">Latest leads</h2>
            <Link href="/admin/leads" className="flex items-center gap-1 text-sm text-muted hover:text-ink">Open CRM <ArrowUpRight className="h-3.5 w-3.5" /></Link>
          </div>
          <ul className="divide-y divide-black/[0.05]">
            {leads.slice(0, 6).map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads?lead=${l.id}`} className="flex items-center gap-3 px-5 py-3 transition hover:bg-black/[0.02] md:px-6">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper text-sm font-semibold">
                    {l.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{l.name}</span>
                    <span className="block truncate text-xs text-muted">{l.city || "—"} · {l.propertyType} · {l.source}</span>
                  </span>
                  <span className="hidden text-right sm:block">
                    <span className="block text-sm font-medium">{inrShort(l.value)}</span>
                    <span className="block text-xs text-muted">{timeAgo(l.createdAt)}</span>
                  </span>
                  <Badge className={STAGE_COLORS[l.stage]}>{l.stage}</Badge>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="grid gap-4">
          <Panel>
            <h2 className="flex items-center gap-2 font-semibold tracking-tight"><CalendarClock className="h-4 w-4" /> Upcoming follow-ups</h2>
            <ul className="mt-4 space-y-3">
              {followUps.length === 0 && <li className="text-sm text-muted">All caught up ✨</li>}
              {followUps.map((l) => (
                <li key={l.id} className="flex items-center gap-3">
                  <span className="w-14 shrink-0 rounded-xl bg-paper py-1.5 text-center">
                    <span className="block text-[10px] uppercase text-muted">{new Date(l.followUp).toLocaleDateString("en-IN", { month: "short" })}</span>
                    <span className="block text-sm font-semibold leading-none">{new Date(l.followUp).getDate()}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{l.name}</span>
                    <span className="block text-xs text-muted">{l.stage}</span>
                  </span>
                  <a href={`tel:${l.phone}`} className="grid h-8 w-8 place-items-center rounded-full bg-black/[0.05] hover:bg-black/10" aria-label={`Call ${l.name}`}>
                    <Phone className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel>
            <h2 className="font-semibold tracking-tight">Lead sources</h2>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full">
              {sources.map(([s, n], i) => (
                <div key={s} style={{ width: `${(n / leads.length) * 100}%`, opacity: 1 - i * 0.14 }} className="sun-bg first:rounded-l-full last:rounded-r-full" title={s} />
              ))}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {sources.map(([s, n], i) => (
                <li key={s} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full sun-bg" style={{ opacity: 1 - i * 0.14 }} />
                  <span className="flex-1 truncate text-ink/80">{s}</span>
                  <span className="text-muted">{n}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Blog posts", counts.posts, "/admin/blog"],
          ["Projects", counts.projects, "/admin/content?tab=projects"],
          ["Services", counts.services, "/admin/content?tab=services"],
          ["Testimonials", counts.testimonials, "/admin/content?tab=testimonials"],
        ].map(([l, n, h]) => (
          <Link key={l as string} href={h as string} className="group rounded-3xl bg-white p-5 ring-1 ring-black/[0.05] transition hover:-translate-y-0.5">
            <p className="text-sm text-muted">{l}</p>
            <p className="mt-1 flex items-center justify-between text-2xl font-semibold tracking-tight">
              {n}
              <ArrowUpRight className="h-4 w-4 text-muted transition group-hover:text-ink" />
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
