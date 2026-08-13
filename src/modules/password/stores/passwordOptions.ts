import { createStore } from "solid-js/store";

const DEFAULT_OPTIONS = {
	length: 16,
	includeUppercase: true,
	includeLowercase: true,
	includeNumbers: true,
	includeSymbols: true,
};

const [passwordOptionsStore, setPasswordOptionsStore] = createStore({
	...DEFAULT_OPTIONS,
});

export function usePasswordOptionsStore() {
	const reset = () => {
		setPasswordOptionsStore({ ...DEFAULT_OPTIONS });
	};

	return {
		passwordOptionsStore,
		setPasswordOptionsStore,
		reset,
	};
}
