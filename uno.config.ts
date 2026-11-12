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
    font: {
      sans: '"Inter Variable", ui-sans-serif, system-ui, sans-serif',
      mono: '"JetBrains Mono Variable", ui-monospace, SFMono-Regular, monospace',
    },
  },
});
