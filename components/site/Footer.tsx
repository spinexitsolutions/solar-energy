import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { NavLink, Service, Settings } from "@/lib/types";

export default function Footer({ settings, nav, services }: { settings: Settings; nav: NavLink[]; services: Service[] }) {
  const socials = [
    ["Instagram", settings.instagram],
    ["LinkedIn", settings.linkedin],
    ["YouTube", settings.youtube],
    ["X", settings.x],
  ].filter(([, h]) => h);

  return (
    <footer data-nav="dark" className="relative overflow-hidden bg-night text-white">
      <div
        className="pointer-events-none absolute -bottom-[40vw] left-1/2 h-[80vw] w-[80vw] -translate-x-1/2 rounded-full opacity-50 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 60%)" }}
      />
      <div className="container-x relative pt-20 md:pt-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="text-3xl font-medium leading-tight tracking-[-0.035em] md:text-4xl">
              Ready to make your roof <span className="serif-i sun-text">work for you?</span>
            </p>
            <Link href="/contact" className="btn btn-sun mt-8">
              Book free consultation <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-7 md:grid-cols-3">
            <div>
              <p className="eyebrow mb-4 text-white/40">Explore</p>
              <ul className="space-y-2.5 text-[15px] text-white/75">
                {nav.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="transition hover:text-white">{l.label}</Link>
                  </li>
                ))}
                <li><Link href="/contact" className="transition hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-4 text-white/40">Solutions</p>
              <ul className="space-y-2.5 text-[15px] text-white/75">
                {services.slice(0, 6).map((s) => (
                  <li key={s.id}>
                    <Link href={`/services#${s.id}`} className="transition hover:text-white">{s.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow mb-4 text-white/40">Contact</p>
              <ul className="space-y-2.5 text-[15px] text-white/75">
                <li><a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-white">{settings.phone}</a></li>
                <li><a href={`mailto:${settings.email}`} className="hover:text-white">{settings.email}</a></li>
                <li className="text-white/55">{settings.address}</li>
                <li className="text-white/55">{settings.hours}</li>
              </ul>
              <div className="mt-5 flex flex-wrap gap-2">
                {socials.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer" className="rounded-full bg-white/[0.07] px-3 py-1.5 text-xs text-white/70 transition hover:bg-white/15 hover:text-white">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/10 pt-6 text-xs text-white/40 md:flex md:items-center md:justify-between">
          <p>{settings.footerNote}</p>
          <p className="mt-2 md:mt-0">© {new Date().getFullYear()} {settings.brandName} Energy. All rights reserved.</p>
        </div>
      </div>
      <div className="relative select-none overflow-hidden">
        <p className="display translate-y-[18%] text-center text-[27vw] leading-[0.8] text-white/[0.06]">
          {settings.brandName}
        </p>
      </div>
    </footer>
  );
}
