<script setup lang="ts">
import { ref } from "vue";
import { usePasswordOptionsStore } from "~/stores/password";

const { generatedPassword, copied, generateAndCopy } = usePasswordGenerator();
const passwordOptionsStore = usePasswordOptionsStore();

const isRegenerating = ref(false);
const displayPassword = ref("");
const animationInterval = ref<number | null>(null);

const generateWithAnimation = async () => {
	isRegenerating.value = true;
	const previousPassword =
		displayPassword.value || generatedPassword.value || "";
	let counter = 0;
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";

	if (animationInterval.value) clearInterval(animationInterval.value);

	animationInterval.value = window.setInterval(async () => {
		let tempPassword = "";
		const length = previousPassword.length || passwordOptionsStore.length || 12;
		for (let i = 0; i < length; i++) {
			tempPassword += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		displayPassword.value = tempPassword;
		counter++;

		if (counter > 10) {
			if (animationInterval.value) clearInterval(animationInterval.value);
			await generateAndCopy();
			setTimeout(() => {
				displayPassword.value = generatedPassword.value || "";
				isRegenerating.value = false;
			}, 100);
		}
	}, 30);
};

void copied;
void generateWithAnimation;
</script>

<template>
	<div class="min-h-screen flex items-center justify-center p-0 text-zinc-100">
		<div class="w-full max-w-none bg-transparent rounded-2xl shadow-lg overflow-hidden border border-zinc-800/80">
			<div class="p-6 text-center">
				<div class="flex items-center justify-center gap-3">
					<Icon name="mdi:shield-lock" class="text-4xl text-blue-400" />
					<h1 class="text-3xl font-bold">Password Generator</h1>
				</div>
				<p class="text-zinc-300 text-sm mt-2">
					Create strong, secure, and random passwords
				</p>
			</div>

			<div class="p-5 max-h-[85vh] overflow-y-auto">
				<div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
					<div class="lg:col-span-3">
						<PasswordOptions />
					</div>
					<div class="lg:col-span-2 flex flex-col gap-6">
						<PasswordDisplay
							:display-password="displayPassword"
							:copied="copied"
							:is-regenerating="isRegenerating"
							@generateAndCopy="generateWithAnimation"
						/>
						<SecurityStatus />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
