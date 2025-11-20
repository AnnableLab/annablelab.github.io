import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import robotsTxt from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
  site: "https://sigenergy.annable.me",
  integrations: [mdx(), sitemap(), robotsTxt()],
  compressHTML: false,
  build: {
    format: "file",
  },
  markdown: {
    shikiConfig: {
      theme: "dracula",
    },
  },
  redirects: {
    "/pages/architecture": "/architecture",
    "/pages/automation": "/automation",
    "/pages/conclusion": "/conclusion",
    "/pages/dashboard": "/dashboard",
    "/pages/emhass": "/emhass",
    "/pages/prerequisites": "/prerequisites",
    "/pages/setup": "/setup",
  },
});
