import type { MetadataRoute } from 'next';
import { site } from '@/lib/content';

const routes = ['', '/services', '/roofing', '/siding', '/gutters', '/insurance-claims', '/gallery', '/about', '/contact'];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: path === '' ? 1 : path === '/insurance-claims' || path === '/roofing' ? 0.9 : 0.7,
  }));
}
