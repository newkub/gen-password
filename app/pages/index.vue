<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import PasswordDisplay from "~/components/PasswordDisplay.vue";
import PasswordOptions from "~/components/PasswordOptions.vue";
import SecurityStatus from "~/components/SecurityStatus.vue";

const { passwordOptions, generatedPassword, copied, generate, copy } =
	usePasswordGenerator();

const isRegenerating = ref(false);
const displayPassword = ref("");
const animationInterval = ref<number | null>(null);

const generateWithAnimation = () => {
	isRegenerating.value = true;
	const previousPassword = displayPassword.value || generatedPassword.value
		|| "";
	let counter = 0;
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

	if (animationInterval.value) clearInterval(animationInterval.value);

	animationInterval.value = window.setInterval(() => {
		let tempPassword = "";
		const length = previousPassword.length || passwordOptions.length.value
			|| 12;
		for (let i = 0; i < length; i++) {
			tempPassword += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		displayPassword.value = tempPassword;
		counter++;

		if (counter > 10) {
			if (animationInterval.value) clearInterval(animationInterval.value);
			generate();
			setTimeout(() => {
				displayPassword.value = generatedPassword.value || "";
				isRegenerating.value = false;
			}, 100);
		}
	}, 30);
};

const regenerateInstantly = () => {
	generate();
	displayPassword.value = generatedPassword.value || "";
};

onMounted(() => {
	regenerateInstantly();
});

watch(generatedPassword, (newPassword) => {
	if (!isRegenerating.value) {
		displayPassword.value = newPassword || "";
	}
});

watch(
	() => [
		passwordOptions.length.value,
		passwordOptions.includeUppercase.value,
		passwordOptions.includeLowercase.value,
		passwordOptions.includeNumbers.value,
		passwordOptions.includeSymbols.value,
	],
	() => {
		regenerateInstantly();
	},
	{ deep: true },
);
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-4">
		<div class="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
			<div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-center">
				<h1 class="text-2xl font-bold text-white">Password Generator</h1>
				<p class="text-blue-100 text-sm mt-1">
					Create strong and secure passwords
				</p>
			</div>

			<div class="p-5 max-h-[85vh] overflow-y-auto">
				<div class="flex flex-col gap-6">
					<PasswordOptions />
					<div class="w-full flex flex-col gap-6">
						<PasswordDisplay
							:display-password="displayPassword"
							:copied="copied"
							:is-regenerating="isRegenerating"
							@copy="copy"
							@regenerate="generateWithAnimation"
						/>
						<SecurityStatus />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
