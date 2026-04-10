import type { MetadataRoute } from 'next';

const baseUrl = 'https://chilloutsurf.com';
const locales = ['en', 'de', 'es'];

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    '',
    '/packages',
    '/packages/3-days-all-inclusive',
    '/packages/5-days-all-inclusive',
    '/packages/7-days-all-inclusive',
    '/packages/surf-and-stay',
    '/packages/classic',
    '/packages/premium',
    '/packages/ultimate',
    '/packages/family',
    '/blog',
    '/blog/things-to-do-taghazout',
    '/blog/best-surf-spots-morocco',
    '/blog/surfing-dictionary',
    '/blog/tamraght-vs-taghazout',
    '/contact',
    '/terms',
  ];

  return locales.flatMap(locale =>
    pages.map(page => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly' as const,
      priority: page === '' ? 1 : page.startsWith('/packages') ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          locales.map(l => [l, `${baseUrl}/${l}${page}`])
        ),
      },
    }))
  );
}
