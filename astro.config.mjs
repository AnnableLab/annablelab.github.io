import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sigenergy.annable.me',
  integrations: [sitemap()],
  build: {
    format: 'file'
  }
});

