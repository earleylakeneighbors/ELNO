-- Replace sample events with the November 14 inaugural library dedication

delete from public.events;

insert into public.events (
  title,
  slug,
  description,
  location,
  start_at,
  end_at,
  image_url,
  status
) values (
  'Little Free Library Dedication',
  'little-free-library-dedication',
  E'Join your neighbors for our inaugural neighborhood event — a Little Free Library dedication at Day Park.\n\nCelebrate the new Little Free Library and learn about the new Day Park signs. Please bring a gently used or new book for the Little Free Library.\n\nComplimentary Taco John''s tacos, coffee, cocoa, and water will be provided by the Earley Lake Neighborhood Organization.\n\nCome meet your neighbors and celebrate together!',
  'Day Park pavilion, Burnsville, MN',
  '2026-11-14T20:00:00.000Z',
  '2026-11-14T22:00:00.000Z',
  '/images/poster-hero-ducks.jpg',
  'published'
);
