import { storeToRefs } from "pinia";
import { ref } from "vue";

import { usePasswordOptionsStore } from '~/stores/password';
import type { PasswordOptions } from "~/types/password";

const CHARACTER_SETS = {
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	numbers: "0123456789",
	symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

const generatePassword = (options: PasswordOptions): string => {
	let validChars = "";
	if (options.includeUppercase) validChars += CHARACTER_SETS.uppercase;
	if (options.includeLowercase) validChars += CHARACTER_SETS.lowercase;
	if (options.includeNumbers) validChars += CHARACTER_SETS.numbers;
	if (options.includeSymbols) validChars += CHARACTER_SETS.symbols;

	if (!validChars) {
		throw new Error("Please select at least one character type");
	}

	let password = "";
	for (let i = 0; i < options.length; i++) {
		password += validChars.charAt(Math.floor(Math.random() * validChars.length));
	}
	return password;
};

const copyToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch (err) {
		console.error("Failed to copy to clipboard:", err);
		return false;
	}
};

export const usePasswordGenerator = () => {
	const passwordOptionsStore = usePasswordOptionsStore();
	const { ...passwordOptions } = storeToRefs(passwordOptionsStore);

	const generatedPassword = ref("");
	const copied = ref(false);
	const error = ref("");

	const generate = () => {
		try {
			error.value = "";
			generatedPassword.value = generatePassword(passwordOptionsStore.$state);
			copied.value = false;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate password";
		}
	};

	const copy = async () => {
		if (!generatedPassword.value) return;
		const success = await copyToClipboard(generatedPassword.value);
		if (success) {
			copied.value = true;
			setTimeout(() => (copied.value = false), 2000);
		}
	};

	const reset = () => {
		passwordOptionsStore.reset();
		generatedPassword.value = "";
		copied.value = false;
		error.value = "";
	};

	return {
		passwordOptions,
		generatedPassword,
		copied,
		error,
		generate,
		copy,
		reset,
	};
};
