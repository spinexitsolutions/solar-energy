"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Eye, Loader2, PenLine, Save } from "lucide-react";
import type { Post } from "@/lib/types";
import { savePost } from "@/lib/actions";
import Markdown from "@/components/site/Markdown";
import { ImageField } from "./Fields";
import { Toggle, useToast } from "./ui";

export default function PostEditor({ post }: { post: Post }) {
  const [p, setP] = useState(post);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [pending, start] = useTransition();
  const router = useRouter();
  const toast = useToast();
  const set = <K extends keyof Post>(k: K, v: Post[K]) => setP((x) => ({ ...x, [k]: v }));

  const save = () => {
    if (!p.title.trim()) return toast("Add a title first", "err");
    start(async () => {
      const words = p.content.split(/\s+/).length;
      const saved = await savePost({ ...p, readTime: p.readTime || `${Math.max(1, Math.round(words / 220))} min` });
      toast(saved.published ? "Article published" : "Draft saved");
      if (!post.id) router.replace(`/admin/blog/${saved.id}`);
      else setP(saved);
      router.refresh();
    });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link href="/admin/blog" className="flex items-center gap-2 text-sm text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" /> All articles</Link>
        <div className="flex items-center gap-3">
          <Toggle checked={p.published} onChange={(v) => set("published", v)} label={p.published ? "Published" : "Draft"} />
          <button onClick={save} disabled={pending} className="btn btn-ink !px-5 !py-2.5 text-sm">
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        <div className="rounded-3xl bg-white p-5 ring-1 ring-black/[0.05] md:p-8">
          <input value={p.title} onChange={(e) => set("title", e.target.value)} placeholder="Article title" className="w-full bg-transparent text-3xl font-semibold tracking-[-0.04em] outline-none placeholder:text-black/20 md:text-4xl" />
          <textarea value={p.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="A one-line summary that appears on cards…" rows={2} className="mt-3 w-full resize-none bg-transparent text-lg text-muted outline-none placeholder:text-black/20" />
          <div className="mt-4 flex w-fit rounded-full bg-black/[0.05] p-1 text-sm">
            {([["write", PenLine], ["preview", Eye]] as const).map(([m, I]) => (
              <button key={m} onClick={() => setMode(m)} className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 capitalize ${mode === m ? "bg-white shadow-sm" : "text-muted"}`}>
                <I className="h-3.5 w-3.5" /> {m}
              </button>
            ))}
          </div>
          {mode === "write" ? (
            <>
              <textarea value={p.content} onChange={(e) => set("content", e.target.value)} className="field mt-4 min-h-[480px] font-mono text-sm leading-relaxed" />
              <p className="mt-2 text-xs text-muted">Formatting: blank line = new paragraph · <code>## Heading</code> · <code>- list item</code> · <code>**bold**</code></p>
            </>
          ) : (
            <div className="mt-4 min-h-[480px] rounded-2xl bg-paper p-6"><Markdown source={p.content} /></div>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-4 rounded-3xl bg-white p-5 ring-1 ring-black/[0.05]">
            <div>
              <label className="label">Cover image</label>
              <ImageField value={p.cover} onChange={(v) => set("cover", v)} />
            </div>
            <div>
              <label className="label">URL slug</label>
              <input className="field" value={p.slug} onChange={(e) => set("slug", e.target.value)} placeholder="auto-generated-from-title" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Category</label>
                <input className="field" list="cats" value={p.category} onChange={(e) => set("category", e.target.value)} />
                <datalist id="cats">{["Guides", "Subsidy", "Maintenance", "Commercial", "News", "Case study"].map((c) => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="label">Read time</label>
                <input className="field" value={p.readTime} onChange={(e) => set("readTime", e.target.value)} />
              </div>
              <div>
                <label className="label">Author</label>
                <input className="field" value={p.author} onChange={(e) => set("author", e.target.value)} />
              </div>
              <div>
                <label className="label">Date</label>
                <input type="date" className="field" value={p.date} onChange={(e) => set("date", e.target.value)} />
              </div>
            </div>
          </div>
          {p.id && p.published && (
            <a href={`/blog/${p.slug}`} target="_blank" className="btn w-full bg-white !py-3 text-sm ring-1 ring-black/[0.06]"><Eye className="h-4 w-4" /> View live article</a>
          )}
        </div>
      </div>
    </div>
  );
}
