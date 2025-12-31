export default defineNuxtConfig({
	compatibilityDate: "latest",
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
		preset: "cloudflare-pages",
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
});
