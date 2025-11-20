import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://sigenergy.annable.me',
  integrations: [mdx(), sitemap()],
  build: {
    format: 'file'
  },
  redirects: {
    '/pages/architecture': '/architecture',
    '/pages/automation': '/automation',
    '/pages/conclusion': '/conclusion',
    '/pages/dashboard': '/dashboard',
    '/pages/emhass': '/emhass',
    '/pages/prerequisites': '/prerequisites',
    '/pages/setup': '/setup',
  }
});

