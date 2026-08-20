export const SITE = {
  name: "Earley Lake Neighborhood Organization",
  shortName: "Earley Lake",
  tagline: "Our Lake. Our Neighborhood. Our Community.",
  location: "Burnsville, MN",
  description:
    "The Earley Lake Neighborhood Organization in Burnsville, MN brings neighbors together to promote a safe, welcoming, and inclusive community and to protect and enhance the natural environment and quality of life around Earley Lake.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
