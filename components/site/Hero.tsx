import type { Hero as HeroT, Project, Stat } from "@/lib/types";
import HeroSun from "./heroes/HeroSun";
import HeroCells from "./heroes/HeroCells";
import HeroEclipse from "./heroes/HeroEclipse";
import HeroBill from "./heroes/HeroBill";
import HeroStories from "./heroes/HeroStories";

export const HERO_VARIANTS = ["sun", "cells", "eclipse", "bill", "stories"] as const;

/** Picks the hero design chosen in the admin (or via ?hero= for previews). */
export default function Hero({ hero, projects, stats, variant }: { hero: HeroT; projects: Project[]; stats: Stat[]; variant?: string }) {
  switch (variant ?? hero.variant) {
    case "cells":
      return <HeroCells hero={hero} stats={stats} />;
    case "eclipse":
      return <HeroEclipse hero={hero} stats={stats} />;
    case "bill":
      return <HeroBill hero={hero} projects={projects} />;
    case "stories":
      return <HeroStories hero={hero} projects={projects} />;
    default:
      return <HeroSun hero={hero} />;
  }
}
