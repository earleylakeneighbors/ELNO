import type { Metadata } from "next";
import { getMedia } from "@/lib/data";
import { GalleryClient } from "@/components/admin/gallery-client";

export const metadata: Metadata = {
  title: "Gallery",
  robots: { index: false, follow: false },
};

export default async function AdminGalleryPage() {
  const media = await getMedia();

  return (
    <div>
      <header>
        <h1 className="font-display text-3xl">Gallery</h1>
        <p className="mt-2 text-muted-foreground">
          Featured images appear on the public homepage gallery.
        </p>
      </header>
      <div className="mt-8">
        <GalleryClient media={media} />
      </div>
    </div>
  );
}
