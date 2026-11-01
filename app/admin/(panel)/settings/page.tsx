import { getDB } from "@/lib/db";
import SettingsForm from "@/components/admin/SettingsForm";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const db = await getDB();
  return <SettingsForm settings={db.settings} />;
}
