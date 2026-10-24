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
      ink: {
        950: "#170a04",
        900: "#1e0d05",
        800: "#2a1308",
        700: "#3a1a0b",
      },
      mist: {
        500: "#b08a71",
        400: "#c8a68c",
        300: "#dcc3ad",
        200: "#f0dcc8",
        100: "#fff7ed",
      },
      forge: {
        ember: "#fb923c",
        amber: "#fbbf24",
        flame: "#f97316",
        coral: "#fda4af",
        blush: "#fde68a",
      },
    },
    font: {
      sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace',
    },
  },
});
