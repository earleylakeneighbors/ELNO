import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/data";
import { NewsForm } from "@/components/admin/news-form";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = {
  title: "Edit Post",
  robots: { index: false, follow: false },
};

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params;
  const post = await getNewsById(id);
  if (!post) notFound();

  return (
    <div>
      <h1 className="font-display text-3xl">Edit post</h1>
      <div className="mt-8">
        <NewsForm post={post} />
      </div>
    </div>
  );
}
