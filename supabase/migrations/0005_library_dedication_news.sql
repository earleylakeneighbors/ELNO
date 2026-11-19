-- Post-event recap: first neighborhood social & Little Free Library dedication (Nov 14, 2026)

insert into public.news_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image_url,
  status,
  published_at
)
values (
  'A Wonderful Afternoon of Neighbors, Books & Community!',
  'neighbors-books-community',
  'On November 14, the Earley Lake Neighborhood Organization celebrated a neighborhood social gathering and the dedication of our Little Free Library at Day Park.',
  E'The Earley Lake Neighborhood Organization celebrated a special milestone on November 14 with a neighborhood social gathering and the dedication of our Little Free Library!

Neighbors came together for a wonderful afternoon of friendship, conversation, and community spirit.

Anne McLarnen, who leads the Little Free Library project, shared updates on the project''s progress. We were also delighted to receive new book donations that will help our library continue bringing stories and reading opportunities to our neighborhood.

Thank you to everyone who joined us and helped make this first gathering such a memorable occasion. Your participation and support mean so much to our community.

We look forward to seeing everyone at our future neighborhood events!',
  '/images/librarydedication/WhatsApp%20Image%202026-11-19%20at%202.49.29%20AM.jpeg',
  'published',
  '2026-11-14 18:00:00+00'
)
on conflict (slug) do nothing;