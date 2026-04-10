import { BlogPost } from './types';

export const blogPosts: BlogPost[] = [
  {
    slug: 'things-to-do-taghazout',
    date: '2026-02-10',
    image: '/images/packages/pkg09.jpg',
  },
  {
    slug: 'best-surf-spots-morocco',
    date: '2026-02-10',
    image: '/images/surf/surfer-wave.webp',
  },
  {
    slug: 'surfing-dictionary',
    date: '2026-02-10',
    image: '/images/surf/lesson.webp',
  },
  {
    slug: 'tamraght-vs-taghazout',
    date: '2026-02-10',
    image: '/images/surf/beach-lesson.webp',
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
