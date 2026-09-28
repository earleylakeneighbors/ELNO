import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsById } from "@/lib/data";
import { NewsForm } from "@/components/admin/news-form";
import { PageHeader } from "@/components/admin/page-header";
import { BackLink } from "@/components/admin/back-link";

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
      <BackLink href="/admin/news" label="All posts" />
      <PageHeader eyebrow="Edit post" title={post.title} />
      <div className="mt-8">
        <NewsForm post={post} />
      </div>
    </div>
  );
}
