import type { Metadata } from 'next';

export const siteUrl = 'https://www.buildeurope.io';
export const siteDescription = 'A European engineering conference planned for Amsterdam in October 2027. Explore real engineering stories, hands-on learning and a community championing women in technology.';

export function publicPageMetadata(path: string, title: string, description: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: new URL(path, siteUrl).href },
    openGraph: {
      type: 'website',
      title,
      description,
      url: new URL(path, siteUrl).href,
      siteName: 'BUILD Europe',
      locale: 'en_GB',
      images: [{ url: new URL('/opengraph-image', siteUrl).href, width: 1200, height: 630, alt: 'BUILD Europe — Engineering. Community. Possibility.' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: new URL('/opengraph-image', siteUrl).href, alt: 'BUILD Europe — Engineering. Community. Possibility.' }],
    },
  };
}
