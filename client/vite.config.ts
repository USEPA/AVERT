import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: "build",
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        cobra: path.resolve(__dirname, "cobra/index.html"),
      },
      output: {
        entryFileNames: "static/js/[name]-[hash].js",
        chunkFileNames: "static/js/[name]-[hash].js",
        assetFileNames: ({ name }) => {
          const css = /\.(css)$/.test(name ?? "");
          const font = /\.(woff|woff2|eot|ttf|otf)$/.test(name ?? "");
          const media = /\.(png|jpe?g|gif|svg|webp|webm|mp3)$/.test(name ?? "");
          const type = css ? "css/" : font ? "fonts/" : media ? "media/" : "";
          return `static/${type}[name]-[hash][extname]`;
        },
      },
    },
  },
  define: {
    "process.env": {},
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    open: true,
    port: 3000,
  },
});
