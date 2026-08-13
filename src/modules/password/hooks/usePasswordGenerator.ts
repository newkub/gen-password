import { createSignal } from "solid-js";

import { usePasswordOptions } from "~/modules/password/hooks/usePasswordOptions";
import { generatePassword, copyToClipboard } from "~/lib/password";
import type { PasswordOptions } from "~/modules/password/types/password";

const MIN_LENGTH = 16;

export function usePasswordGenerator() {
	const passwordOptions = usePasswordOptions();

	const [generatedPassword, setGeneratedPassword] = createSignal("");
	const [copied, setCopied] = createSignal(false);
	const [error, setError] = createSignal("");

	const generate = (): string => {
		try {
			setError("");
			setCopied(false);
			const options: PasswordOptions = {
				length: passwordOptions.length(),
				includeUppercase: passwordOptions.includeUppercase(),
				includeLowercase: passwordOptions.includeLowercase(),
				includeNumbers: passwordOptions.includeNumbers(),
				includeSymbols: passwordOptions.includeSymbols(),
			};
			const newPassword = generatePassword(options, MIN_LENGTH);
			setGeneratedPassword(newPassword);
			return newPassword;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to generate password");
			return "";
		}
	};

	const copy = async (text: string): Promise<boolean> => {
		if (!text) return false;
		const success = await copyToClipboard(text);
		if (success) {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
		return success;
	};

	const generateAndCopy = async (): Promise<void> => {
		try {
			setError("");
			const newPassword = generate();
			await copy(newPassword);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to generate and copy password",
			);
		}
	};

	const reset = (): void => {
		passwordOptions.reset();
		setGeneratedPassword("");
		setCopied(false);
		setError("");
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
}
