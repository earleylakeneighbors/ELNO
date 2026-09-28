import type { Metadata } from "next";
import { NewsForm } from "@/components/admin/news-form";
import { PageHeader } from "@/components/admin/page-header";
import { BackLink } from "@/components/admin/back-link";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default function NewNewsPage() {
  return (
    <div>
      <BackLink href="/admin/news" label="All posts" />
      <PageHeader eyebrow="News" title="New post" description="Write it, preview the cover, and publish when you're happy." />
      <div className="mt-8">
        <NewsForm />
      </div>
    </div>
  );
}
