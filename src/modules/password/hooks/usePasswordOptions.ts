import { createSignal } from "solid-js";

const DEFAULT_OPTIONS = {
	length: 16,
	includeUppercase: true,
	includeLowercase: true,
	includeNumbers: true,
	includeSymbols: true,
} as const;

const [length, setLength] = createSignal<number>(DEFAULT_OPTIONS.length);
const [includeUppercase, setIncludeUppercase] = createSignal<boolean>(
	DEFAULT_OPTIONS.includeUppercase,
);
const [includeLowercase, setIncludeLowercase] = createSignal<boolean>(
	DEFAULT_OPTIONS.includeLowercase,
);
const [includeNumbers, setIncludeNumbers] = createSignal<boolean>(
	DEFAULT_OPTIONS.includeNumbers,
);
const [includeSymbols, setIncludeSymbols] = createSignal<boolean>(
	DEFAULT_OPTIONS.includeSymbols,
);

function reset(): void {
	setLength(DEFAULT_OPTIONS.length);
	setIncludeUppercase(DEFAULT_OPTIONS.includeUppercase);
	setIncludeLowercase(DEFAULT_OPTIONS.includeLowercase);
	setIncludeNumbers(DEFAULT_OPTIONS.includeNumbers);
	setIncludeSymbols(DEFAULT_OPTIONS.includeSymbols);
}

export function usePasswordOptions() {
	return {
		length,
		setLength,
		includeUppercase,
		setIncludeUppercase,
		includeLowercase,
		setIncludeLowercase,
		includeNumbers,
		setIncludeNumbers,
		includeSymbols,
		setIncludeSymbols,
		reset,
	};
}
