import react from "@vitejs/plugin-react";
import hydrogen from "@shopify/hydrogen/plugin";
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
      // fileName: (format, name) =>
      //   name == "plugin" ? `${format}/plugin.js` : `${format}/index.js`,
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
  ssr: { noExternal: ["@nosto/nosto-react"] },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       client: resolve(__dirname, "src/components/index.client.js"),
  //       server: resolve(__dirname, "src/components/index.server.js"),
  //     },
  //     external: [
  //       "react",
  //       "react-dom",
  //       "@shopify/hydrogen",
  //       // "@nosto/nosto-react",
  //     ],
  //     output: [
  //       {
  //         format: "es",
  //         dir: "dist/es",
  //         entryFileNames: "entry-[name].js",
  //         globals: {
  //           react: "React",
  //           "react-dom": "ReactDOM",
  //         },
  //       },
  //       {
  //         format: "cjs",
  //         dir: "dist/cjs",
  //         entryFileNames: "entry-[name].js",
  //         globals: {
  //           react: "React",
  //           "react-dom": "ReactDOM",
  //         },
  //       },
  //     ],
  //   },
  // },
});
