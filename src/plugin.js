"use strict";

const nostoHydrogen = () => ({
  name: "nosto-hydrogen-plugin",
  config: () => ({
    enforce: "pre",
    optimizeDeps: {
      include: ["js-sha256", "@nosto/shopify-hydrogen"],
    },
  }),
});

exports.default = nostoHydrogen; // For ESM
module.exports = nostoHydrogen;
