"use strict";

const nostoHydrogen = () => ({
  name: "nosto-hydrogen-plugin",
  config: () => ({
    enforce: "pre",
    ssr: {
      noExternal: ["@nosto/shopify-hydrogen"],
    },
    optimizeDeps: {
      include: ["js-sha256", "@nosto/shopify-hydrogen"],
    },
  }),
});

exports.default = nosto; // For ESM
module.exports = nosto;
