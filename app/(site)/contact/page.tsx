import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getDB } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import LeadForm from "@/components/site/LeadForm";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = { title: "Contact" };

type Props = { searchParams: Promise<{ service?: string; package?: string }> };

export default async function ContactPage({ searchParams }: Props) {
  const db = await getDB();
  const sp = await searchParams;
  const svc = db.services.find((s) => s.id === sp.service);
  const pkg = db.packages.find((k) => k.id === sp.package);
  const msg = pkg ? `Interested in the ${pkg.name} (${pkg.capacity}) package.` : svc ? `Interested in ${svc.title}.` : "";
  const s = db.settings;
  const items = [
    { icon: Phone, label: "Call us", value: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: s.email, href: `mailto:${s.email}` },
    { icon: MapPin, label: "Visit", value: s.address, href: `https://maps.google.com/?q=${encodeURIComponent(s.address)}` },
    { icon: Clock, label: "Hours", value: s.hours },
  ];

  return (
    <>
      <PageHeader label="Contact" title="Let’s light up" highlight="your roof." subtitle="Tell us a little about your property. We’ll get back with a custom design and quote — usually the same day." />
      <section className="container-x grid gap-6 py-16 md:grid-cols-[1.3fr_1fr] md:py-24">
        <Reveal>
          <LeadForm defaultMessage={msg} />
        </Reveal>
        <div className="grid content-start gap-3">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 0.06}>
              <a href={it.href} target={it.href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="card flex items-start gap-4 p-5 transition hover:-translate-y-0.5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl sun-bg text-[#1a0d00]">
                  <it.icon className="h-5 w-5" strokeWidth={1.8} />
                </span>
                <span>
                  <span className="block text-xs text-muted">{it.label}</span>
                  <span className="mt-0.5 block font-medium">{it.value}</span>
                </span>
              </a>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <div className="overflow-hidden rounded-[1.75rem] ring-1 ring-line">
              <iframe
                title="Office location"
                src={`https://www.google.com/maps?q=${encodeURIComponent(s.address)}&output=embed`}
                className="h-64 w-full grayscale"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
