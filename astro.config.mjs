import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import sitemap from "@astrojs/sitemap";
import robotsTxt from "astro-robots-txt";
import rehypeExternalLinks from "rehype-external-links";

// https://astro.build/config
export default defineConfig({
  site: "https://sigenergy.annable.me",
  integrations: [
    sitemap(),
    robotsTxt(),
    starlight({
      title: "Sigenergy with Home Assistant and EMHASS",
      description:
        "Step-by-step guide automating a Sigenergy system with Home Assistant using EMHASS and Amber Electric in Australia.",
      tableOfContents: false,
      head: [
        {
          tag: 'script',
          attrs: {
            async: true,
            src: 'https://www.googletagmanager.com/gtag/js?id=G-HNTKBKHJY3',
          },
        },
        {
          tag: 'script',
          attrs: {},
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "G-HNTKBKHJY3");
          `,
        },
        {
          tag: 'script',
          attrs: {},
          content: `
            // Set dark mode as default if no preference is stored
            if (!localStorage.getItem('starlight-theme')) {
              localStorage.setItem('starlight-theme', 'dark');
              document.documentElement.dataset.theme = 'dark';
            }
          `,
        },
      ],
      customCss: ['./src/styles/custom.css'],
      sidebar: [
        {
          label: "EMHASS Guide",
          items: [
            { label: "Home", link: "/" },
            { label: "Architecture", link: "/architecture" },
            { label: "Prerequisites", link: "/prerequisites" },
            { label: "EMHASS Setup", link: "/setup" },
            { label: "Running EMHASS", link: "/emhass" },
            { label: "Dashboard", link: "/dashboard" },
            { label: "Battery Automation", link: "/automation" },
            { label: "Conclusion", link: "/conclusion" },
          ],
        },
        {
          label: "Debugging",
          items: [
            { label: "Trace Downloading", link: "/trace" },
          ],
        },
      ],
    }),
  ],
  compressHTML: false,
  markdown: {
    shikiConfig: {
      theme: "github-dark-default",
    },
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
        },
      ],
    ],
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
