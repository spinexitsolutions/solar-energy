import Link from "next/link";
import { Plus } from "lucide-react";
import { getDB } from "@/lib/db";
import { PageTitle } from "@/components/admin/AdminShell";
import BlogList from "@/components/admin/BlogList";

export const metadata = { title: "Blog" };

export default async function BlogAdmin() {
  const db = await getDB();
  return (
    <div>
      <PageTitle
        title="Blog"
        subtitle={`${db.posts.filter((p) => p.published).length} published · ${db.posts.filter((p) => !p.published).length} drafts`}
        actions={<Link href="/admin/blog/new" className="btn btn-ink !px-4 !py-2.5 text-sm"><Plus className="h-4 w-4" /> New article</Link>}
      />
      <BlogList posts={[...db.posts].sort((a, b) => b.date.localeCompare(a.date))} />
    </div>
  );
}
