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

export default defineEventHandler(async (event) => {
	const options = await readBody<PasswordOptions>(event);

	try {
		const password = generatePassword(options);
		return { password };
	} catch (error) {
		throw createError({
			statusCode: 400,
			statusMessage: error instanceof Error ? error.message : "Invalid options",
		});
	}
});
