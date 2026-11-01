"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { ExternalLink, FileText, KanbanSquare, LayoutDashboard, LogOut, PanelsTopLeft, Settings } from "lucide-react";
import type { ReactNode } from "react";
import { logout } from "@/lib/actions";
import { ToastProvider } from "./ui";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "CRM", icon: KanbanSquare },
  { href: "/admin/content", label: "Website", icon: PanelsTopLeft },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminShell({ children, brand, newLeads }: { children: ReactNode; brand: string; newLeads: number }) {
  const path = usePathname();
  const active = (h: string) => (h === "/admin" ? path === h : path.startsWith(h));

  return (
    <ToastProvider>
      <div className="min-h-dvh bg-[#f5f5f7] text-ink">
        {/* sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-black/[0.06] bg-white/70 p-4 backdrop-blur-xl lg:flex">
          <Link href="/admin" className="flex items-center gap-3 px-2 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-night">
              <span className="h-3.5 w-3.5 rounded-full sun-bg" />
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-tight tracking-tight">{brand}</span>
              <span className="block text-[11px] text-muted">Admin studio</span>
            </span>
          </Link>
          <nav className="mt-8 space-y-1">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px]">
                {active(n.href) && (
                  <motion.span layoutId="admin-nav" className="absolute inset-0 rounded-xl bg-black/[0.05]" transition={{ type: "spring", stiffness: 400, damping: 34 }} />
                )}
                <n.icon className={`relative h-[18px] w-[18px] ${active(n.href) ? "text-ink" : "text-muted"}`} strokeWidth={1.8} />
                <span className={`relative ${active(n.href) ? "font-medium" : "text-ink/70"}`}>{n.label}</span>
                {n.href === "/admin/leads" && newLeads > 0 && (
                  <span className="relative ml-auto rounded-full sun-bg px-2 py-0.5 text-[11px] font-semibold text-[#1a0d00]">{newLeads}</span>
                )}
              </Link>
            ))}
          </nav>
          <div className="mt-auto space-y-1 border-t border-black/[0.06] pt-4">
            <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-ink/70 hover:bg-black/[0.04]">
              <ExternalLink className="h-[18px] w-[18px] text-muted" strokeWidth={1.8} /> View website
            </a>
            <form action={logout}>
              <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] text-ink/70 hover:bg-black/[0.04]">
                <LogOut className="h-[18px] w-[18px] text-muted" strokeWidth={1.8} /> Sign out
              </button>
            </form>
          </div>
        </aside>

        {/* mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/[0.06] bg-white/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-night"><span className="h-3 w-3 rounded-full sun-bg" /></span>
            <span className="font-semibold tracking-tight">{brand}</span>
          </Link>
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5" aria-label="View website"><ExternalLink className="h-4 w-4" /></a>
            <form action={logout}><button className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5" aria-label="Sign out"><LogOut className="h-4 w-4" /></button></form>
          </div>
        </header>

        <main className="pb-28 lg:pb-10 lg:pl-64">
          <div className="mx-auto max-w-[1400px] p-4 md:p-8">{children}</div>
        </main>

        {/* mobile tab bar */}
        <nav className="fixed inset-x-3 bottom-3 z-40 flex justify-around rounded-[1.4rem] bg-white/85 p-1.5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.25)] ring-1 ring-black/5 backdrop-blur-xl lg:hidden">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="relative flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-2 text-[10px]">
              {active(n.href) && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-2xl bg-black/[0.06]" />}
              <span className="relative">
                <n.icon className="h-5 w-5" strokeWidth={active(n.href) ? 2.2 : 1.7} />
                {n.href === "/admin/leads" && newLeads > 0 && <span className="absolute -right-1.5 -top-1 h-2.5 w-2.5 rounded-full sun-bg ring-2 ring-white" />}
              </span>
              <span className={`relative ${active(n.href) ? "font-semibold" : "text-muted"}`}>{n.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </ToastProvider>
  );
}

export function PageTitle({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:mb-8 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-[-0.04em] md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-muted">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
