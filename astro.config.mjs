import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://hideoutbutler.com",
  output: "static",
  adapter: cloudflare({
    imageService: "compile",
  }),
  integrations: [tailwind()],
});
