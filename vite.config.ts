import { defineConfig } from "vite";

export default defineConfig({
  // Relative paths work both on a custom domain and at /<repository>/ on GitHub Pages.
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        changelog: "changelog/index.html",
      },
    },
  },
});
