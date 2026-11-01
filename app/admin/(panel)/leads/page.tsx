import { getDB } from "@/lib/db";
import LeadsCRM from "@/components/admin/LeadsCRM";

export const metadata = { title: "CRM" };

export default async function LeadsPage({ searchParams }: { searchParams: Promise<{ lead?: string }> }) {
  const db = await getDB();
  const { lead } = await searchParams;
  return <LeadsCRM initial={db.leads} openId={lead} />;
}
