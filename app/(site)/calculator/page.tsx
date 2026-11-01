import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import Calculator from "@/components/site/Calculator";
import Faq from "@/components/site/Faq";

export const metadata: Metadata = { title: "Savings calculator" };

export default async function CalculatorPage() {
  const db = await getDB();
  return (
    <>
      <PageHeader
        label="Savings calculator"
        title="Your bill, minus"
        highlight="the sun."
        subtitle="Instant estimate of system size, subsidy, payback and 25-year savings — based on live tariff data."
      />
      <div className="h-12" />
      <Calculator config={db.calculator} standalone />
      <Faq faqs={db.faqs} />
    </>
  );
}
