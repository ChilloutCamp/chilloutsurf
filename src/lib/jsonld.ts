export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Chillout Surf Camp',
    url: 'https://chilloutsurf.com',
    logo: 'https://chilloutsurf.com/images/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-715-511-910',
      contactType: 'reservations',
      availableLanguage: ['English', 'German', 'Spanish'],
    },
    sameAs: [
      'https://www.facebook.com/chilloutsurf',
      'https://www.instagram.com/chilloutsurf',
      'https://www.youtube.com/chilloutsurf',
    ],
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Chillout Surf Camp Taghazout',
    description: 'Surf camp in Taghazout Bay, Morocco with 15+ years experience. All-inclusive packages from €225.',
    url: 'https://chilloutsurf.com',
    telephone: '+212-715-511-910',
    email: 'booking@chilloutsurf.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Taghazout Bay',
      postalCode: '800023',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 30.5441,
      longitude: -9.7102,
    },
    priceRange: '€225 - €1999',
    image: 'https://chilloutsurf.com/images/hero/group-surf-lesson.webp',
  };
}

export function productSchema(name: string, description: string, price: number, currency: string = 'EUR') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
      url: 'https://chilloutsurf.com/en/contact',
    },
    brand: {
      '@type': 'Organization',
      name: 'Chillout Surf Camp',
    },
  };
}

export function blogPostingSchema(title: string, date: string, url: string, image?: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: date,
    url,
    image: image || 'https://chilloutsurf.com/images/hero/group-surf-lesson.webp',
    author: {
      '@type': 'Organization',
      name: 'Chillout Surf Camp',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Chillout Surf Camp',
      logo: {
        '@type': 'ImageObject',
        url: 'https://chilloutsurf.com/images/logo.png',
      },
    },
  };
}
