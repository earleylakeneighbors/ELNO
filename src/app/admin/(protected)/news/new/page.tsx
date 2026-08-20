import type { Metadata } from "next";
import { NewsForm } from "@/components/admin/news-form";

export const metadata: Metadata = {
  title: "New Post",
  robots: { index: false, follow: false },
};

export default function NewNewsPage() {
  return (
    <div>
      <h1 className="font-display text-3xl">New post</h1>
      <div className="mt-8">
        <NewsForm />
      </div>
    </div>
  );
}
