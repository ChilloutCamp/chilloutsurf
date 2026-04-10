export type Locale = 'en' | 'de' | 'es';
export const locales: Locale[] = ['en', 'de', 'es'];
export const defaultLocale: Locale = 'en';

export interface SurfPackage {
  slug: string;
  price: number;
  priceUnit: 'person' | 'family';
  duration: { nights: number; days: number };
  badge?: string; // only on "7-days-all-inclusive"
  image: string;
  surfLessons: { days: number; hoursPerDay: number } | null;
}

export interface BlogPost {
  slug: string;
  date: string;
  image?: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
}

export interface GalleryCategory {
  id: string;
  images: GalleryImage[];
}
