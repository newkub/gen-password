import { createMemo } from "solid-js";

import { usePasswordOptions } from "~/modules/password/hooks/usePasswordOptions";
import type { SecurityLevel } from "~/modules/password/types/password";

const MIN_LENGTH = 16;

export function useSecurity() {
	const passwordOptions = usePasswordOptions();

	const securityLevel = createMemo<SecurityLevel>(() => {
		const selectedTypes = [
			passwordOptions.includeUppercase(),
			passwordOptions.includeLowercase(),
			passwordOptions.includeNumbers(),
			passwordOptions.includeSymbols(),
		].filter(Boolean).length;

		const len = passwordOptions.length();

		if (selectedTypes === 4 && len >= MIN_LENGTH) return "veryStrong";
		if (selectedTypes === 4 && len >= 12) return "strong";
		if (selectedTypes >= 3 && len >= 10) return "medium";
		if (selectedTypes >= 2 && len >= 8) return "weak";
		return "veryWeak";
	});

	const securityLevelText = createMemo(() => {
		switch (securityLevel()) {
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

	const securityLevelColor = createMemo(() => {
		switch (securityLevel()) {
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

	const securityLevelBackgroundColor = createMemo(() => {
		switch (securityLevel()) {
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

	const securityLevelGlow = createMemo(() => {
		switch (securityLevel()) {
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

	const securityLevelWidth = createMemo(() => {
		switch (securityLevel()) {
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
}
