const nostoHydrogenPlugin = () => ({
  name: "nosto-hydrogen-plugin",
  config: () => ({
    optimizeDeps: {
      include: ["js-sha256"],
    },
  }),
});

export default nostoHydrogenPlugin;
