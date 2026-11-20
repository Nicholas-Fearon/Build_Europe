import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/', '/about', '/attend', '/sponsor', '/speak', '/speak/guide', '/contact',
    '/privacy', '/terms', '/cookies', '/accessibility', '/code-of-conduct',
  ];

  return paths.map(path => ({ url: new URL(path, 'https://www.buildeurope.io').href }));
}
