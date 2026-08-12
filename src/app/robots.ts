import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard',
          '/dream',
          '/dreams',
          '/insights',
          '/chat',
          '/calendar',
          '/settings',
          '/dream-universe',
          '/api',
        ],
      },
    ],
    sitemap: 'https://dreamjournal.ai/sitemap.xml',
  };
}
