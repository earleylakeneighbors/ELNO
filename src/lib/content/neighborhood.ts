export const SLOGAN = "Our Lake. Our Neighborhood. Our Community.";

export const MISSION =
  "The Earley Lake Neighborhood Organization brings neighbors together to promote a safe, welcoming, and inclusive community and to protect and enhance the natural environment and quality of life around Earley Lake.";

export const VISION =
  "A thriving neighborhood where people connect, nature flourishes, and future generations enjoy the beauty, tranquility, and strong sense of community that make Earley Lake special.";

export const BOUNDARIES = [
  "143rd St W (north)",
  "Burnhaven Dr (east)",
  "Southcross Dr (south)",
  "County Road 5 (west)",
] as const;

/** "143rd St W (north)" → { road: "143rd St W", side: "North" } */
export function parseBoundary(entry: string) {
  const match = entry.match(/^(.*)\s+\((\w+)\)$/);
  if (!match) return { road: entry, side: "" };
  return { road: match[1], side: match[2][0].toUpperCase() + match[2].slice(1) };
}

export const BOUNDARIES_SUMMARY =
  "Our neighborhood boundaries are: 143rd St W (north) • Burnhaven Dr (east) • Southcross Dr (south) • County Road 5 (west).";

export type WildlifeGalleryItem = {
  src: string;
  caption: string;
  alt: string;
};

export const WILDLIFE_GALLERY: WildlifeGalleryItem[] = [
  {
    src: "/images/wildlife-wood-ducks.jpg",
    caption: "Wood Ducks",
    alt: "Two wood ducks swimming on Earley Lake",
  },
  {
    src: "/images/wildlife-turtles-1.jpg",
    caption: "Turtles",
    alt: "Turtles basking on a log in a Minnesota pond",
  },
  {
    src: "/images/wildlife-swans.jpg",
    caption: "Swans",
    alt: "Two white swans swimming among reeds",
  },
  {
    src: "/images/wildlife-trumpeter-swan.jpg",
    caption: "Trumpeter Swan",
    alt: "A trumpeter swan gliding across calm water",
  },
  {
    src: "/images/wildlife-great-blue-heron.jpg",
    caption: "Great Blue Heron",
    alt: "A great blue heron standing in marsh reeds",
  },
  {
    src: "/images/wildlife-fall-colors.jpg",
    caption: "Fall Colors",
    alt: "Autumn trees along the Earley Lake shoreline",
  },
  {
    src: "/images/wildlife-turtles-2.jpg",
    caption: "Turtles",
    alt: "Four turtles lined up on a log in a pond",
  },
  {
    src: "/images/wildlife-fall-reflections.jpg",
    caption: "Fall Reflections",
    alt: "Fall foliage reflected in still lake water",
  },
];
