import {
  BatteryCharging, Building2, Car, Factory, Gauge, House, Leaf, PlugZap,
  ShieldCheck, Sprout, Sun, Wrench, Zap, type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  house: House,
  factory: Factory,
  "battery-charging": BatteryCharging,
  "plug-zap": PlugZap,
  "shield-check": ShieldCheck,
  sprout: Sprout,
  sun: Sun,
  zap: Zap,
  leaf: Leaf,
  wrench: Wrench,
  building: Building2,
  car: Car,
  gauge: Gauge,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const C = ICONS[name] ?? Sun;
  return <C className={className} strokeWidth={1.6} />;
}
