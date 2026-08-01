import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  output: "static",
  site: "https://genealogie-arrouasse-amsellem.netlify.app",
  integrations: [tailwind({ applyBaseStyles: false })],
});
