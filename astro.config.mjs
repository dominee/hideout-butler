import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://hideoutbutler.com",
  integrations: [tailwind()],
});
