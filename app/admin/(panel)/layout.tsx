import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { getDB } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  const db = await getDB();
  return (
    <AdminShell brand={db.settings.brandName} newLeads={db.leads.filter((l) => l.stage === "New").length}>
      {children}
    </AdminShell>
  );
}
