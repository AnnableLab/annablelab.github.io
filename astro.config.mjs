import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://sigenergy.annable.me",
  integrations: [
    starlight({
      title: "Sigenergy with Home Assistant and EMHASS",
      description:
        "Step-by-step guide automating a Sigenergy system with Home Assistant using EMHASS and Amber Electric in Australia.",
      sidebar: [
        {
          label: "Guide",
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
      ],
    }),
  ],
});
