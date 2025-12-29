export default defineNuxtConfig({
	compatibilityDate: "latest",
	ssr: false,
	devtools: { enabled: true },
	runtimeConfig: {
		public: {
			passwordMinLength: 16,
		},
	},
	modules: [
		"nuxt-mcp-dev",
		"@pinia/nuxt",
		"@unocss/nuxt",
		"@nuxt/icon",
		"@vueuse/nuxt",
		"@nuxtjs/color-mode",
		"@vue-macros/nuxt",
	],
	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},
	typescript: {
		typeCheck: false,
		strict: true,
	},
});
