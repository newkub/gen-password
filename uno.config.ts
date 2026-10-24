import {
  defineConfig,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  presets: [presetWind4({ preflights: { reset: true } })],
  transformers: [transformerVariantGroup(), transformerDirectives()],
  theme: {
    colors: {
      coal: {
        950: "#100d0b",
        900: "#14100d",
        800: "#1a1512",
        700: "#221c17",
      },
      sand: {
        50: "#f5eee3",
        100: "#efe7dc",
        200: "#d8c8b4",
        300: "#bda88f",
        400: "#a2917f",
      },
      forge: {
        ember: "#fb923c",
        amber: "#fbbf24",
        flame: "#f97316",
        coral: "#f6a28d",
        blush: "#fdba74",
      },
    },
    font: {
      sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace',
    },
  },
});
