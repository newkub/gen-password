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
				return "text-emerald-400";
			case "strong":
				return "text-sky-400";
			case "medium":
				return "text-amber-300";
			case "weak":
				return "text-orange-400";
			default:
				return "text-rose-400";
		}
	});

	const securityLevelBackgroundColor = computed(() => {
		switch (securityLevel.value) {
			case "veryStrong":
				return "bg-gradient-to-r from-emerald-500 via-green-400 to-lime-300";
			case "strong":
				return "bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500";
			case "medium":
				return "bg-gradient-to-r from-amber-400 via-yellow-400 to-lime-300";
			case "weak":
				return "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400";
			default:
				return "bg-gradient-to-r from-rose-600 via-red-500 to-orange-500";
		}
	});

	const securityLevelGlow = computed(() => {
		switch (securityLevel.value) {
			case "veryStrong":
				return "shadow-[0_0_18px_rgba(52,211,153,0.35)]";
			case "strong":
				return "shadow-[0_0_18px_rgba(56,189,248,0.35)]";
			case "medium":
				return "shadow-[0_0_18px_rgba(251,191,36,0.30)]";
			case "weak":
				return "shadow-[0_0_18px_rgba(251,146,60,0.30)]";
			default:
				return "shadow-[0_0_18px_rgba(251,113,133,0.30)]";
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
		securityLevelGlow,
		securityLevelWidth,
	};
};
