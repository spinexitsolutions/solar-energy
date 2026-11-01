import type { Metadata } from "next";
import { getDB } from "@/lib/db";
import PageHeader from "@/components/site/PageHeader";
import BlogCard from "@/components/site/BlogCard";
import { Reveal } from "@/components/site/Reveal";

export const metadata: Metadata = { title: "Journal" };

export default async function BlogPage() {
  const db = await getDB();
  const posts = db.posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const [first, ...rest] = posts;
  return (
    <>
      <PageHeader label="Journal" title="Notes on" highlight="clean energy." subtitle="Guides, subsidy updates and stories from rooftops across India." />
      <section className="container-x py-16 md:py-24">
        {!first && <p className="text-muted">No articles yet.</p>}
        {first && (
          <Reveal>
            <BlogCard post={first} big />
          </Reveal>
        )}
        <div className="mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08}>
              <BlogCard post={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
