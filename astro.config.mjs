import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import tailwindcss from "@tailwindcss/vite";

import metaTags from "astro-meta-tags";

import decapCmsOauth from "astro-decap-cms-oauth";

const site =
  process.env.CF_PAGES_URL ??
  "http://localhost:4321";

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap(), mdx(), pagefind(), metaTags(),
      decapCmsOauth({
        decapCMSSrcUrl: "https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js",
      }),
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: "css-variables",
    },
  }
});
