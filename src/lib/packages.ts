import { SurfPackage } from './types';

export const packages: SurfPackage[] = [
  {
    slug: '3-days-all-inclusive',
    price: 225,
    priceUnit: 'person',
    duration: { nights: 3, days: 3 },
    image: '/images/packages/pkg01.jpg',
    surfLessons: { days: 3, hoursPerDay: 2 },
  },
  {
    slug: '5-days-all-inclusive',
    price: 375,
    priceUnit: 'person',
    duration: { nights: 5, days: 5 },
    image: '/images/packages/pkg04.jpg',
    surfLessons: { days: 5, hoursPerDay: 2 },
  },
  {
    slug: '7-days-all-inclusive',
    price: 499,
    priceUnit: 'person',
    duration: { nights: 7, days: 8 },
    badge: 'mostBooked',
    image: '/images/packages/group-beach.webp',
    surfLessons: { days: 7, hoursPerDay: 2 },
  },
  {
    slug: 'surf-and-stay',
    price: 399,
    priceUnit: 'person',
    duration: { nights: 7, days: 8 },
    image: '/images/packages/pkg09.jpg',
    surfLessons: null,
  },
  {
    slug: 'classic',
    price: 449,
    priceUnit: 'person',
    duration: { nights: 7, days: 8 },
    image: '/images/packages/pkg03.jpg',
    surfLessons: null,
  },
  {
    slug: 'premium',
    price: 649,
    priceUnit: 'person',
    duration: { nights: 7, days: 8 },
    image: '/images/packages/pkg02.jpg',
    surfLessons: { days: 6, hoursPerDay: 2 },
  },
  {
    slug: 'ultimate',
    price: 749,
    priceUnit: 'person',
    duration: { nights: 7, days: 8 },
    image: '/images/packages/pkg11.jpg',
    surfLessons: { days: 4, hoursPerDay: 2 },
  },
  {
    slug: 'family',
    price: 1999,
    priceUnit: 'family',
    duration: { nights: 7, days: 8 },
    image: '/images/packages/pkg01.jpg',
    surfLessons: { days: 7, hoursPerDay: 2 },
  },
];

export function getPackageBySlug(slug: string): SurfPackage | undefined {
  return packages.find((p) => p.slug === slug);
}
