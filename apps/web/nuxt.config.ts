import checker from "vite-plugin-checker";

export default defineNuxtConfig({
	compatibilityDate: "2025-12-31",
	ssr: false,
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
	icon: {
		serverBundle: {
			collections: ["mdi"],
		},
	},
	typescript: {
		typeCheck: true,
		strict: true,
	},
	nitro: {
		preset: "cloudflare_module",
		cloudflare: {
			deployConfig: true,
			nodeCompat: true,
			wrangler: {
				routes: [
					{
						pattern: "gen-password.wrikka.com",
						custom_domain: true,
					},
				],
			},
		},
	},
	vite: {
		plugins: [
			checker({
				overlay: {
					initialIsOpen: false,
				},
				typescript: true,
				vueTsc: true,
				oxlint: true,
			}),
		],
	},
});
