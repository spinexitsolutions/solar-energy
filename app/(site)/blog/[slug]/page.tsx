import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getDB } from "@/lib/db";
import Markdown from "@/components/site/Markdown";
import ReadingProgress from "@/components/site/ReadingProgress";
import BlogCard, { fmtDate } from "@/components/site/BlogCard";
import CTA from "@/components/site/CTA";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await getDB()).posts.find((p) => p.slug === slug);
  return post ? { title: post.title, description: post.excerpt, openGraph: { images: [post.cover] } } : {};
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const db = await getDB();
  const post = db.posts.find((p) => p.slug === slug && p.published);
  if (!post) notFound();
  const more = db.posts.filter((p) => p.published && p.id !== post.id).slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <article className="pt-32 md:pt-44">
        <div className="container-x max-w-3xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
            <ArrowLeft className="h-4 w-4" /> Journal
          </Link>
          <p className="eyebrow mt-8 text-muted">{post.category} · {fmtDate(post.date)} · {post.readTime} read</p>
          <h1 className="display mt-4 text-[3.4rem] md:text-[6.5rem]">{post.title}</h1>
          <p className="mt-6 text-xl text-muted">{post.excerpt}</p>
          <p className="mt-6 text-sm">By <span className="font-medium">{post.author}</span></p>
        </div>
        <div className="container-x mt-12">
          <img src={post.cover} alt="" className="h-[45vh] w-full rounded-[4px] object-cover md:h-[70vh]" />
        </div>
        <div className="container-x max-w-3xl py-16">
          <Markdown source={post.content} />
        </div>
      </article>
      {more.length > 0 && (
        <section className="container-x border-t border-line py-20">
          <h2 className="text-3xl font-semibold tracking-[-0.04em]">Keep reading</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {more.map((p) => <BlogCard key={p.id} post={p} />)}
          </div>
        </section>
      )}
      <CTA settings={db.settings} />
    </>
  );
}
