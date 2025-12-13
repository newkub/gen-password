import { computed } from "vue";

import { usePasswordOptionsStore } from "~/stores/password";
import type { SecurityLevel } from "~/types/password";

export const useSecurity = () => {
	const passwordOptions = usePasswordOptionsStore();

	const securityLevel = computed<SecurityLevel>(() => {
		const selectedTypes = [
			passwordOptions.includeUppercase,
			passwordOptions.includeLowercase,
			passwordOptions.includeNumbers,
			passwordOptions.includeSymbols,
		].filter(Boolean).length;

		const length = passwordOptions.length;

		if (selectedTypes === 4 && length >= 16) return "veryStrong";
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
				return "bg-green-500";
			case "strong":
				return "bg-blue-500";
			case "medium":
				return "bg-yellow-500";
			case "weak":
				return "bg-orange-500";
			default:
				return "bg-red-500";
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
