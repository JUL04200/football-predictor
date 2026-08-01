/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        nuit: "#101E2E",
        zellige: "#17324B",
        vert: "#2E7268",
        laiton: "#C89B4A",
        pierre: "#EBE6DC",
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      backgroundImage: {
        khatem: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath fill='none' stroke='%23C89B4A' stroke-width='1.5' d='M50 4 L61 32 L92 26 L69 48 L92 74 L61 68 L50 96 L39 68 L8 74 L31 48 L8 26 L39 32 Z'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
