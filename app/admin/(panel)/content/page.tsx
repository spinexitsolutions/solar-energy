import { Suspense } from "react";
import { getContent } from "@/lib/db";
import ContentStudio from "@/components/admin/ContentStudio";

export const metadata = { title: "Website content" };

export default async function ContentPage() {
  const content = await getContent();
  return (
    <Suspense>
      <ContentStudio content={content} />
    </Suspense>
  );
}
