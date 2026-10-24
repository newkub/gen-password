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
      cream: {
        50: "#fffdf9",
        100: "#fff7ed",
        200: "#ffedd5",
        300: "#fed7aa",
      },
      ink: {
        950: "#241006",
        900: "#3b1d0e",
        800: "#4d2814",
        700: "#6b3a1f",
        500: "#96603f",
        400: "#b3805e",
      },
      forge: {
        ember: "#fb923c",
        amber: "#fbbf24",
        flame: "#f97316",
        coral: "#b91c1c",
        blush: "#fdba74",
      },
    },
    font: {
      sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace',
    },
  },
});
