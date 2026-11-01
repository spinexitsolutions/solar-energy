"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Post } from "@/lib/types";
import { deletePost, savePost } from "@/lib/actions";
import { Badge, Toggle, useToast } from "./ui";

export default function BlogList({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const toast = useToast();
  const [, start] = useTransition();
  if (!posts.length) return <p className="rounded-3xl bg-white p-10 text-center text-muted">No articles yet — write your first one.</p>;
  return (
    <div className="grid gap-3">
      {posts.map((p) => (
        <div key={p.id} className="flex items-center gap-4 rounded-3xl bg-white p-3 ring-1 ring-black/[0.05]">
          <img src={p.cover} alt="" className="h-20 w-28 shrink-0 rounded-2xl object-cover md:h-24 md:w-36" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <Badge className="bg-black/[0.05] text-ink/70">{p.category}</Badge>
              <span className="text-xs text-muted">{p.date}</span>
            </div>
            <Link href={`/admin/blog/${p.id}`} className="mt-1 line-clamp-2 font-semibold tracking-tight hover:underline md:text-lg">{p.title}</Link>
            <p className="hidden truncate text-sm text-muted md:block">{p.excerpt}</p>
          </div>
          <div className="flex flex-col items-end gap-2 md:flex-row md:items-center md:gap-4">
            <Toggle
              checked={p.published}
              label={p.published ? "Live" : "Draft"}
              onChange={(v) =>
                start(async () => {
                  await savePost({ ...p, published: v });
                  toast(v ? "Published" : "Moved to drafts");
                  router.refresh();
                })
              }
            />
            <div className="flex">
              <Link href={`/admin/blog/${p.id}`} className="grid h-9 w-9 place-items-center rounded-full hover:bg-black/5" aria-label="Edit"><Pencil className="h-4 w-4" /></Link>
              <a href={`/blog/${p.slug}`} target="_blank" className="hidden h-9 w-9 place-items-center rounded-full hover:bg-black/5 md:grid" aria-label="View"><ExternalLink className="h-4 w-4" /></a>
              <button
                onClick={() => {
                  if (!confirm(`Delete “${p.title}”?`)) return;
                  start(async () => {
                    await deletePost(p.id);
                    toast("Article deleted");
                    router.refresh();
                  });
                }}
                className="grid h-9 w-9 place-items-center rounded-full text-muted hover:bg-red-50 hover:text-red-600"
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
