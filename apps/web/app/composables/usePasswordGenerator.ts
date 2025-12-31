import { ref } from "vue";

import { usePasswordOptions } from "~/composables/usePasswordOptions";
import type { PasswordOptions } from "~/types/password";

const CHARACTER_SETS = {
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	numbers: "0123456789",
	symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

const generatePassword = (
	options: PasswordOptions,
	minLength: number,
): string => {
	let validChars = "";
	if (options.includeUppercase) validChars += CHARACTER_SETS.uppercase;
	if (options.includeLowercase) validChars += CHARACTER_SETS.lowercase;
	if (options.includeNumbers) validChars += CHARACTER_SETS.numbers;
	if (options.includeSymbols) validChars += CHARACTER_SETS.symbols;

	if (!validChars) {
		throw new Error("Please select at least one character type");
	}

	const length = Math.max(options.length, minLength);
	let password = "";
	for (let i = 0; i < length; i++) {
		password += validChars.charAt(
			Math.floor(Math.random() * validChars.length),
		);
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
	const config = useRuntimeConfig();
	const minLength = Number(config.public.passwordMinLength) || 16;

	const passwordOptions = usePasswordOptions();

	const generatedPassword = ref("");
	const copied = ref(false);
	const error = ref("");

	const generate = () => {
		try {
			error.value = "";
			copied.value = false;
			const options: PasswordOptions = {
				length: passwordOptions.length.value,
				includeUppercase: passwordOptions.includeUppercase.value,
				includeLowercase: passwordOptions.includeLowercase.value,
				includeNumbers: passwordOptions.includeNumbers.value,
				includeSymbols: passwordOptions.includeSymbols.value,
			};
			const newPassword = generatePassword(
				options,
				minLength,
			);
			generatedPassword.value = newPassword;
			return newPassword;
		} catch (err) {
			error.value = err instanceof Error ? err.message : "Failed to generate password";
			return "";
		}
	};

	const copy = async (text: string) => {
		if (!text) return false;
		const success = await copyToClipboard(text);
		if (success) {
			copied.value = true;
			setTimeout(() => {
				copied.value = false;
			}, 2000);
		}
		return success;
	};

	const generateAndCopy = async () => {
		try {
			error.value = "";
			const newPassword = generate();
			await copy(newPassword);
		} catch (err) {
			error.value = err instanceof Error
				? err.message
				: "Failed to generate and copy password";
		}
	};

	const reset = () => {
		passwordOptions.reset();
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
		generateAndCopy,
		reset,
	};
};
