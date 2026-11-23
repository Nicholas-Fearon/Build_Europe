import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/', '/about', '/attend', '/sponsor', '/speak', '/speak/guide', '/contact',
    '/privacy', '/terms', '/cookies', '/accessibility', '/code-of-conduct',
  ];

  return paths.map(path => ({ url: new URL(path, siteUrl).href }));
}
