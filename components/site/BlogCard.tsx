import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Post } from "@/lib/types";

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function BlogCard({ post, big = false }: { post: Post; big?: boolean }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-[1.75rem] bg-paper-2 ${big ? "aspect-[16/10]" : "aspect-[4/3]"}`}>
        <img src={post.cover} alt={post.title} className="h-full w-full object-cover transition duration-[1.2s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105" />
        <span className="glass absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium">{post.category}</span>
        <span className="absolute bottom-4 right-4 grid h-11 w-11 translate-y-3 place-items-center rounded-full bg-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-5 font-mono text-xs text-muted">{fmtDate(post.date)} · {post.readTime} read</p>
      <h3 className={`mt-2 font-semibold tracking-[-0.03em] transition group-hover:text-ink/70 ${big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`}>{post.title}</h3>
      <p className="mt-2 line-clamp-2 text-muted">{post.excerpt}</p>
    </Link>
  );
}
