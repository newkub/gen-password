export default defineNuxtConfig({
	compatibilityDate: "latest",
	devtools: { enabled: true },
	modules: [
		"nuxt-mcp-dev",
		"@pinia/nuxt",
		"@unocss/nuxt",
		"@nuxt/icon",
		"@vueuse/nuxt",
		"@nuxtjs/color-mode",
		"@vue-macros/nuxt",
	],
	colorMode: {
		classSuffix: "",
		preference: "dark",
		fallback: "dark",
	},
	nitro: {
		prerender: {
			autoSubfolderIndex: false,
		},
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
		},
	},
	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},
	typescript: {
		typeCheck: false,
		strict: true,
	},
	vite: {
		plugins: [],
	},
});
