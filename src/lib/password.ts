import type { PasswordOptions } from "~/modules/password/types/password";

const CHARACTER_SETS = {
	uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
	lowercase: "abcdefghijklmnopqrstuvwxyz",
	numbers: "0123456789",
	symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

const FULL_CHARACTER_SET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export function generatePassword(
	options: PasswordOptions,
	minLength: number,
): string {
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
}

export function createRandomPassword(passwordLength: number): string {
	const safeLength = Math.max(0, Math.min(32, Math.floor(passwordLength)));
	let password = "";
	for (let i = 0; i < safeLength; i++) {
		password += FULL_CHARACTER_SET.charAt(
			Math.floor(Math.random() * FULL_CHARACTER_SET.length),
		);
	}
	return password;
}

export function getFullCharacterSet(): string {
	return FULL_CHARACTER_SET;
}

export async function copyToClipboard(text: string): Promise<boolean> {
	if (!text) return false;
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			const successful = document.execCommand("copy");
			document.body.removeChild(textArea);
			if (successful) return true;
		} catch {
			// fallback failed
		}
		return false;
	}
}
