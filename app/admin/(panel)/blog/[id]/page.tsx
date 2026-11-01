import { notFound } from "next/navigation";
import { getDB } from "@/lib/db";
import PostEditor from "@/components/admin/PostEditor";
import type { Post } from "@/lib/types";
import { IMG } from "@/lib/seed";

export default async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDB();
  const blank: Post = {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "## Introduction\n\nStart writing…",
    cover: IMG.blueSky,
    category: "Guides",
    author: "Team " + db.settings.brandName,
    readTime: "4 min",
    date: new Date().toISOString().slice(0, 10),
    published: false,
  };
  const post = id === "new" ? blank : db.posts.find((p) => p.id === id);
  if (!post) notFound();
  return <PostEditor post={post} />;
}
