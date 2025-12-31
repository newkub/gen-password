<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const length = ref(16);
const isRegenerating = ref(false);
const displayPassword = ref("");
const copied = ref(false);
const animationInterval = ref<number | null>(null);

const CHARACTER_SET =
	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

const createPassword = (passwordLength: number) => {
	const safeLength = Math.max(0, Math.min(32, Math.floor(passwordLength)));
	let password = "";
	for (let i = 0; i < safeLength; i++) {
		password += CHARACTER_SET.charAt(
			Math.floor(Math.random() * CHARACTER_SET.length),
		);
	}
	return password;
};

const copyToClipboard = async (text: string) => {
	if (!text) return false;
	try {
		await navigator.clipboard.writeText(text);
		copied.value = true;
		setTimeout(() => {
			copied.value = false;
		}, 1200);
		return true;
	} catch {
		return false;
	}
};

onMounted(() => {
	generateWithAnimation();
});

onBeforeUnmount(() => {
	if (animationInterval.value) clearInterval(animationInterval.value);
});

const generateWithAnimation = async () => {
	isRegenerating.value = true;
	const previousPassword = displayPassword.value || "";
	let counter = 0;
	const characters = CHARACTER_SET;

	if (animationInterval.value) clearInterval(animationInterval.value);

	animationInterval.value = window.setInterval(() => {
		let tempPassword = "";
		const targetLength = previousPassword.length || length.value;
		for (let i = 0; i < targetLength; i++) {
			tempPassword += characters.charAt(
				Math.floor(Math.random() * characters.length),
			);
		}
		displayPassword.value = tempPassword;
		counter++;

		if (counter > 10) {
			if (animationInterval.value) clearInterval(animationInterval.value);
			const finalPassword = createPassword(length.value);
			displayPassword.value = finalPassword;
			void copyToClipboard(finalPassword);
			isRegenerating.value = false;
		}
	}, 30);
};

watch(
	() => length.value,
	() => {
		generateWithAnimation();
	},
);
</script>

<template>
	<div class="min-h-full flex items-center justify-center p-0 text-zinc-100">
		<div class="w-11/12 md:w-11/12 max-w-6xl bg-transparent rounded-2xl shadow-lg overflow-y-auto border border-zinc-800/80">
			<div class="p-6 text-center">
				<div class="flex items-center justify-center gap-3">
					<Icon name="mdi:shield-lock" class="text-4xl text-blue-400" />
					<h1 class="text-3xl font-bold">Password Generator</h1>
				</div>
				<p class="text-zinc-300 text-sm mt-2">
					Create strong, secure, and random passwords
				</p>
			</div>

			<div class="p-5 space-y-6">
				<div
					class="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-8 md:p-12 cursor-pointer"
					@click="generateWithAnimation"
				>
					<div class="flex items-center justify-between gap-4">
						<div class="text-sm text-zinc-300">
							<span v-if="copied">Copied</span>
							<span v-else>Click to randomize & copy</span>
						</div>
						<div class="text-xs text-zinc-400">
							Length {{ length }}/32
						</div>
					</div>

					<div
						class="mt-7 w-full text-center font-mono text-5xl md:text-7xl tracking-wider break-all select-all"
						:class="isRegenerating ? 'opacity-70' : 'opacity-100'"
					>
						<span
							class="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 drop-shadow"
						>
							{{ displayPassword }}
						</span>
					</div>

					<div class="mt-16 grid gap-2">
						<input
							type="range"
							id="length"
							min="0"
							max="32"
							v-model.number="length"
							class="w-full h-1 bg-zinc-900/60 rounded-lg appearance-none cursor-pointer accent-zinc-400"
						/>
						<div class="text-[11px] text-zinc-600 text-center">0 / 32</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
