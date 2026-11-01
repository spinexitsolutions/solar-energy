export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <section className="py-14 md:py-20">
      <p className="eyebrow mb-8 text-center text-muted">Trusted hardware partners</p>
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
        <div className="flex w-max animate-marquee gap-14 pr-14 hover:[animation-play-state:paused] md:gap-24 md:pr-24">
          {row.map((p, i) => (
            <span key={i} className="flex items-center gap-14 whitespace-nowrap text-2xl font-semibold tracking-[-0.04em] text-ink/30 transition-colors hover:text-ink md:gap-24 md:text-4xl">
              {p}
              <span className="h-2 w-2 rounded-full sun-bg opacity-60" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
