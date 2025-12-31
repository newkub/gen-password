<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { usePasswordOptionsStore } from "~/stores/password";

const { generatedPassword, copied, copy, generate, generateAndCopy } =
	usePasswordGenerator();
const passwordOptionsStore = usePasswordOptionsStore();

const isRegenerating = ref(false);
const displayPassword = ref("");
const animationInterval = ref<number | null>(null);

const imageSeed = ref(`${Date.now()}`);
const imageUrl = computed(
	() => `https://picsum.photos/seed/${imageSeed.value}/1280/720`,
);

onMounted(() => {
	const initial = generate();
	if (initial) displayPassword.value = initial;
});

const handleCopy = async () => {
	await copy(displayPassword.value || generatedPassword.value || "");
};

const generateWithAnimation = async () => {
	imageSeed.value = `${Date.now()}-${Math.random()}`;
	isRegenerating.value = true;
	const previousPassword = displayPassword.value || generatedPassword.value
		|| "";
	let counter = 0;
	let characters = "";
	if (passwordOptionsStore.includeUppercase) {
		characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	}
	if (passwordOptionsStore.includeLowercase) {
		characters += "abcdefghijklmnopqrstuvwxyz";
	}
	if (passwordOptionsStore.includeNumbers) characters += "0123456789";
	if (passwordOptionsStore.includeSymbols) {
		characters += "!@#$%^&*()_+-=[]{}|;:,.<>?";
	}
	if (!characters) {
		characters =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	}

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

watch(
	() => [
		passwordOptionsStore.length,
		passwordOptionsStore.includeUppercase,
		passwordOptionsStore.includeLowercase,
		passwordOptionsStore.includeNumbers,
		passwordOptionsStore.includeSymbols,
	],
	() => {
		displayPassword.value = "";
		isRegenerating.value = false;
		if (animationInterval.value) clearInterval(animationInterval.value);
		animationInterval.value = null;
	},
);

void copied;
void handleCopy;
void generateWithAnimation;
void imageUrl;
</script>

<template>
	<div class="min-h-full flex items-center justify-center p-0 text-zinc-100">
		<div class="w-11/12 md:w-3/4 max-h-full bg-transparent rounded-2xl shadow-lg overflow-y-auto border border-zinc-800/80">
			<div class="p-6 text-center">
				<div class="flex items-center justify-center gap-3">
					<Icon name="mdi:shield-lock" class="text-4xl text-blue-400" />
					<h1 class="text-3xl font-bold">Password Generator</h1>
				</div>
				<p class="text-zinc-300 text-sm mt-2">
					Create strong, secure, and random passwords
				</p>
			</div>

			<div class="p-5">
				<div class="grid grid-cols-1 lg:grid-cols-6 gap-6">
					<div class="lg:col-span-4">
						<PasswordOptions />
					</div>
					<div class="lg:col-span-2 flex flex-col gap-6 h-full">
						<PasswordDisplay
							:display-password="displayPassword"
							:copied="copied"
							:is-regenerating="isRegenerating"
							@generateAndCopy="generateWithAnimation"
							@copy="handleCopy"
						/>
						<div class="overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-950/40">
							<div class="w-full aspect-video">
								<img
									:src="imageUrl"
									alt="Random image"
									class="w-full h-full object-cover"
									loading="lazy"
									decoding="async"
								/>
							</div>
							<div class="px-3 py-2 text-xs text-zinc-400 border-t border-zinc-800/80">
								sponsored by xxx
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
