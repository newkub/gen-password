import { storeToRefs } from "pinia";
import { ref } from "vue";

import { usePasswordOptionsStore } from "~/stores/password";
import type { GeneratePasswordResponse } from "~/types/password";


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

	const generate = async () => {
		try {
			error.value = "";
			const response = await $fetch<GeneratePasswordResponse>("/api/generate-password", {
				method: "POST",
				body: passwordOptionsStore.$state,
			});
			generatedPassword.value = response.password;
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
