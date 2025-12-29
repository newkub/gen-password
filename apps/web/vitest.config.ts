import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'nuxt',
    coverage: {
      provider: 'v8',
      reporter: ['verbose', 'html']
    },
    typecheck: {
      checker: 'vue-tsc'
    },
  }
})
