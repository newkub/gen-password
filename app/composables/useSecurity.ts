import { computed } from "vue";

import { usePasswordOptionsStore } from "~/stores/password";
import type { SecurityLevel } from "~/types/password";

export const useSecurity = () => {
	const config = useRuntimeConfig();
	const minLength = Number(config.public.passwordMinLength) || 16;

	const passwordOptions = usePasswordOptionsStore();

	const securityLevel = computed<SecurityLevel>(() => {
		const selectedTypes = [
			passwordOptions.includeUppercase,
			passwordOptions.includeLowercase,
			passwordOptions.includeNumbers,
			passwordOptions.includeSymbols,
		].filter(Boolean).length;

		const length = passwordOptions.length;

		if (selectedTypes === 4 && length >= minLength) return "veryStrong";
		if (selectedTypes === 4 && length >= 12) return "strong";
		if (selectedTypes >= 3 && length >= 10) return "medium";
		if (selectedTypes >= 2 && length >= 8) return "weak";
		return "veryWeak";
	});

	const securityLevelText = computed(() => {
		switch (securityLevel.value) {
			case "veryStrong":
				return "Very Strong";
			case "strong":
				return "Strong";
			case "medium":
				return "Medium";
			case "weak":
				return "Weak";
			default:
				return "Very Weak";
		}
	});

	const securityLevelColor = computed(() => {
		switch (securityLevel.value) {
			case "veryStrong":
				return "text-green-400";
			case "strong":
				return "text-blue-400";
			case "medium":
				return "text-yellow-400";
			case "weak":
				return "text-orange-400";
			default:
				return "text-red-400";
		}
	});

	const securityLevelBackgroundColor = computed(() => {
		switch (securityLevel.value) {
			case "veryStrong":
				return "bg-gradient-to-r from-emerald-500 to-green-400";
			case "strong":
				return "bg-gradient-to-r from-sky-500 to-blue-500";
			case "medium":
				return "bg-gradient-to-r from-amber-400 to-yellow-400";
			case "weak":
				return "bg-gradient-to-r from-orange-500 to-amber-500";
			default:
				return "bg-gradient-to-r from-rose-600 to-red-500";
		}
	});

	const securityLevelWidth = computed(() => {
		switch (securityLevel.value) {
			case "veryStrong":
				return 100;
			case "strong":
				return 80;
			case "medium":
				return 60;
			case "weak":
				return 40;
			default:
				return 20;
		}
	});

	return {
		securityLevel,
		securityLevelText,
		securityLevelColor,
		securityLevelBackgroundColor,
		securityLevelWidth,
	};
};
