<script setup lang="ts">
import { computed } from "vue";

import { usePasswordOptionsStore } from "~/stores/password";

const passwordOptions = usePasswordOptionsStore();

void passwordOptions;

const config = useRuntimeConfig();
const minPasswordLength = Number(config.public.passwordMinLength) || 16;

const lengthModel = computed({
	get: () => passwordOptions.length,
	set: (value: number) => {
		passwordOptions.length = Math.max(value, minPasswordLength);
	},
});

void lengthModel;
</script>

<template>
	<div class="w-full bg-zinc-800/40 rounded-lg p-5 border border-zinc-700/70">
		<div class="flex items-center gap-3 mb-5">
			<Icon name="mdi:cogs" class="text-2xl text-blue-400" />
			<h2 class="text-xl font-bold text-white">Password Options</h2>
		</div>

		<!-- Length Control -->
		<div class="mb-6">
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
				<label class="text-base font-semibold text-zinc-200"
				>Password Length</label>
				<span
					class="text-lg font-bold text-blue-400 bg-zinc-900/80 px-4 py-1.5 rounded-md border border-zinc-700/70"
				>
					{{ passwordOptions.length }}
				</span>
			</div>
			<div class="space-y-3">
				<input
					v-model.number="lengthModel"
					type="range"
					:min="minPasswordLength"
					max="50"
					class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
				/>
				<div class="flex justify-between text-sm text-zinc-500">
					<span>0</span>
					<span>50</span>
				</div>
			</div>
		</div>

		<!-- Character Types -->
		<div>
			<h3 class="text-base font-semibold text-zinc-200 mb-2">
				Character Types
			</h3>
			<p class="text-xs text-zinc-500 mb-4">
				Select the character types to include in your password.
			</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<button
					@click="passwordOptions.includeUppercase = !passwordOptions.includeUppercase"
					class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
					:class="passwordOptions.includeUppercase
					? 'bg-blue-500/20 border-blue-500 text-white'
					: 'bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60'"
				>
					<Icon name="mdi:format-letter-case-upper" class="text-2xl mr-3" />
					<div>
						<div class="font-medium">Uppercase</div>
						<div class="text-sm text-zinc-400">(A-Z)</div>
					</div>
				</button>
				<button
					@click="passwordOptions.includeLowercase = !passwordOptions.includeLowercase"
					class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
					:class="passwordOptions.includeLowercase
					? 'bg-blue-500/20 border-blue-500 text-white'
					: 'bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60'"
				>
					<Icon name="mdi:format-letter-case-lower" class="text-2xl mr-3" />
					<div>
						<div class="font-medium">Lowercase</div>
						<div class="text-sm text-zinc-400">(a-z)</div>
					</div>
				</button>
				<button
					@click="passwordOptions.includeNumbers = !passwordOptions.includeNumbers"
					class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
					:class="passwordOptions.includeNumbers
					? 'bg-blue-500/20 border-blue-500 text-white'
					: 'bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60'"
				>
					<Icon name="mdi:numeric" class="text-2xl mr-3" />
					<div>
						<div class="font-medium">Numbers</div>
						<div class="text-sm text-zinc-400">(0-9)</div>
					</div>
				</button>
				<button
					@click="passwordOptions.includeSymbols = !passwordOptions.includeSymbols"
					class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
					:class="passwordOptions.includeSymbols
					? 'bg-blue-500/20 border-blue-500 text-white'
					: 'bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60'"
				>
					<Icon name="mdi:pound" class="text-2xl mr-3" />
					<div>
						<div class="font-medium">Symbols</div>
						<div class="text-sm text-zinc-400">(!@#$%)</div>
					</div>
				</button>
			</div>
		</div>
	</div>
</template>
