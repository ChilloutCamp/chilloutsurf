import type { Metadata } from 'next';

const baseUrl = 'https://chilloutsurf.com';

interface MetadataOptions {
  title: string;
  description: string;
  path: string;
  lang: string;
  image?: string;
}

export function makeMetadata({ title, description, path, lang, image }: MetadataOptions): Metadata {
  const url = `${baseUrl}/${lang}${path}`;
  const ogImage = image || `${baseUrl}/images/og-image.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en${path}`,
        de: `${baseUrl}/de${path}`,
        es: `${baseUrl}/es${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Chillout Surf Camp Taghazout',
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale: lang,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}
