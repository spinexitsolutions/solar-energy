import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";
import BlogCard from "./BlogCard";
import { Reveal, SectionLabel } from "./Reveal";

export default function BlogPreview({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  return (
    <section className="container-x py-20 md:py-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <SectionLabel index="08">Journal</SectionLabel>
          <h2 className="display mt-5 text-5xl md:text-7xl">
            Learn the <span className="sun-text">light.</span>
          </h2>
        </div>
        <Link href="/blog" className="btn btn-ghost shrink-0 whitespace-nowrap !py-3 text-sm">
          All articles <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="no-scrollbar -mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {posts.slice(0, 3).map((p, i) => (
          <Reveal key={p.id} delay={i * 0.1} className="w-[82vw] shrink-0 snap-start md:w-auto">
            <BlogCard post={p} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
