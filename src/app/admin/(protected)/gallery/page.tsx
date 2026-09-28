import type { Metadata } from "next";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { getMedia } from "@/lib/data";
import { GalleryClient } from "@/components/admin/gallery-client";
import { PageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Gallery",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  const media = await getMedia();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Library"
        title="Gallery"
        description="Curate the photos neighbors see on the homepage."
        actions={
          <Button asChild variant="outline">
            <Link href="/admin/media">
              <ImagePlus className="h-4 w-4" /> Add media
            </Link>
          </Button>
        }
      />
      <GalleryClient media={media} />
    </div>
  );
}
