import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import type { WildlifeGalleryItem } from "@/lib/content/neighborhood";
import { cn } from "@/lib/utils";

type WildlifeGridProps = {
  items: WildlifeGalleryItem[];
  className?: string;
};

export function WildlifeGrid({ items, className }: WildlifeGridProps) {
  return (
    <Reveal
      stagger
      className={cn(
        "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4",
        className,
      )}
    >
      {items.map((item) => (
        <figure
          key={`${item.src}-${item.caption}`}
          className="group relative overflow-hidden rounded-2xl"
        >
          <div className="relative aspect-square">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/70 via-foreground/25 to-transparent px-3 pb-3 pt-10">
              <figcaption className="font-display text-sm text-primary-foreground sm:text-base">
                {item.caption}
              </figcaption>
            </div>
          </div>
        </figure>
      ))}
    </Reveal>
  );
}
