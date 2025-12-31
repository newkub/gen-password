import type { Ref } from "vue";

import { useState } from "nuxt/app";

const defaultPasswordOptions = {
	length: 16,
	includeUppercase: true,
	includeLowercase: true,
	includeNumbers: true,
	includeSymbols: true,
} as const;

type PasswordOptionsState = {
	length: Ref<number>;
	includeUppercase: Ref<boolean>;
	includeLowercase: Ref<boolean>;
	includeNumbers: Ref<boolean>;
	includeSymbols: Ref<boolean>;
};

export const usePasswordOptions = (): PasswordOptionsState & { reset: () => void } => {
	const length = useState<number>("passwordOptions:length", () => defaultPasswordOptions.length);
	const includeUppercase = useState<boolean>(
		"passwordOptions:includeUppercase",
		() => defaultPasswordOptions.includeUppercase,
	);
	const includeLowercase = useState<boolean>(
		"passwordOptions:includeLowercase",
		() => defaultPasswordOptions.includeLowercase,
	);
	const includeNumbers = useState<boolean>(
		"passwordOptions:includeNumbers",
		() => defaultPasswordOptions.includeNumbers,
	);
	const includeSymbols = useState<boolean>(
		"passwordOptions:includeSymbols",
		() => defaultPasswordOptions.includeSymbols,
	);

	const reset = () => {
		length.value = defaultPasswordOptions.length;
		includeUppercase.value = defaultPasswordOptions.includeUppercase;
		includeLowercase.value = defaultPasswordOptions.includeLowercase;
		includeNumbers.value = defaultPasswordOptions.includeNumbers;
		includeSymbols.value = defaultPasswordOptions.includeSymbols;
	};

	return {
		length,
		includeUppercase,
		includeLowercase,
		includeNumbers,
		includeSymbols,
		reset,
	};
};
