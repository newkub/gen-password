import { defineStore } from "pinia";

const defaultOptions = {
	length: 16,
	includeUppercase: true,
	includeLowercase: true,
	includeNumbers: true,
	includeSymbols: true,
};

export const usePasswordOptionsStore = defineStore("passwordOptions", {
	state: () => ({ ...defaultOptions }),
	actions: {
		reset() {
			this.$patch(defaultOptions);
		},
	},
});
