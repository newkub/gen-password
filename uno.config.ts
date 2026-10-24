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
        950: "#05060a",
        900: "#080a12",
        800: "#0d101b",
        700: "#151a28",
      },
      mist: {
        500: "#5f687c",
        400: "#7d869c",
        300: "#9aa3b8",
        200: "#c5cbda",
        100: "#e9ecf4",
      },
      forge: {
        violet: "#a78bfa",
        mint: "#5eead4",
        sky: "#38bdf8",
        coral: "#fb7185",
        amber: "#fcd34d",
      },
    },
    font: {
      sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace',
    },
  },
});
