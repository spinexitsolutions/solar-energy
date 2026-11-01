import { getDB } from "@/lib/db";
import Dashboard from "@/components/admin/Dashboard";

export default async function AdminHome() {
  const db = await getDB();
  return (
    <Dashboard
      leads={[...db.leads].sort((a, b) => b.createdAt.localeCompare(a.createdAt))}
      name="Admin"
      counts={{ posts: db.posts.length, projects: db.projects.length, services: db.services.length, testimonials: db.testimonials.length }}
    />
  );
}
