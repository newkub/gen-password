import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: "nuxt",
		coverage: {
			provider: "v8",
			reporter: ["verbose", "html"],
		},
		typecheck: {
			checker: "vue-tsc",
		},
	},
});
