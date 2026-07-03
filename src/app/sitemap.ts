import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/services', '/insurance-claims', '/gallery', '/about', '/contact'];
  const now = new Date();
  return routes.map((r) => ({
    url: `${site.url}${r}`,
    lastModified: now,
    changeFrequency: r === '' ? 'weekly' : 'monthly',
    priority: r === '' ? 1 : r === '/contact' || r === '/insurance-claims' ? 0.9 : 0.7,
  }));
}
