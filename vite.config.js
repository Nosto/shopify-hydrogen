import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
//
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ["@nosto/nosto-react"],
  },
  build: {
    lib: {
      entry: {
        client: resolve(__dirname, "src/components/index.client.js"),
        server: resolve(__dirname, "src/components/index.server.js"),
      },

      name: "@nosto/shopify-hydrogen",
      formats: ["es"],
      fileName: (format, name) =>
        name == "plugin" ? `${format}/plugin.js` : `${format}/index.${name}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "@shopify/hydrogen"],
      output: {
        assetName: "test",
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  test: {
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
