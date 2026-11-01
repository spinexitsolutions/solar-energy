import type { CalculatorConfig } from "./types";

export type PropertyKind = "home" | "society" | "business";

export function calculate(bill: number, kind: PropertyKind, c: CalculatorConfig) {
  const tariff = kind === "business" ? c.tariff * 1.35 : kind === "society" ? c.tariff * 0.95 : c.tariff;
  const units = bill / tariff;
  const kw = Math.max(1, Math.ceil((units / c.unitsPerKw) * 2) / 2);
  const panels = Math.ceil((kw * 1000) / c.panelWattage);
  const area = Math.round(kw * 100); // sq ft
  const cost = kw * c.costPerKw * (kind === "business" ? 0.82 : 1);
  let subsidy = 0;
  if (kind === "home") subsidy = Math.min(c.subsidyCap, Math.min(kw, 2) * c.subsidyPerKw + (kw > 2 ? Math.min(1, kw - 2) * 18000 : 0));
  if (kind === "society") subsidy = Math.min(kw, 500) * 18000;
  const net = Math.max(0, cost - subsidy);
  const monthlyGen = kw * c.unitsPerKw;
  const monthlySaving = Math.min(bill, monthlyGen * tariff) * 0.95;
  const yearly = monthlySaving * 12;
  const payback = yearly ? net / yearly : 0;
  // 25 years with 3% tariff escalation and 0.5% degradation
  let lifetime = 0;
  for (let y = 0; y < 25; y++) lifetime += yearly * Math.pow(1.03, y) * Math.pow(0.995, y);
  const co2 = (monthlyGen * 12 * c.co2PerUnit) / 1000; // tonnes / year
  const offset = Math.min(100, Math.round((monthlySaving / Math.max(1, bill)) * 100));
  return { kw, panels, area, cost, subsidy, net, monthlySaving, yearly, payback, lifetime, co2, trees: Math.round(co2 * 45), offset, monthlyGen };
}

export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
export const inrShort = (n: number) => {
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return inr(n);
};
