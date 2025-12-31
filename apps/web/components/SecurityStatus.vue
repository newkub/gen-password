<script setup lang="ts">
import { useSecurity } from "../app/composables/useSecurity";
import { usePasswordOptions } from "~/composables/usePasswordOptions";

const {
	securityLevelColor,
	securityLevelText,
	securityLevelWidth,
	securityLevelBackgroundColor,
	securityLevelGlow,
} = useSecurity();
const passwordOptions = usePasswordOptions();

void securityLevelColor;
void securityLevelText;
void securityLevelWidth;
void securityLevelBackgroundColor;
void securityLevelGlow;
void passwordOptions;
</script>

<template>
	<div class="bg-zinc-800/40 rounded-lg p-5 border border-zinc-700/70">
		<div class="flex items-center gap-3 mb-4">
			<Icon name="mdi:security" class="text-2xl text-blue-400" />
			<h3 class="font-semibold text-white text-lg">Security Analysis</h3>
		</div>
		<div class="space-y-4">
			<div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-zinc-200"
					>Character Types:</span>
					<div class="flex items-center space-x-2">
						<Icon
							name="mdi:format-letter-case-upper"
							class="text-xl"
							:class="passwordOptions.includeUppercase.value
							? 'text-green-400'
							: 'text-zinc-600'"
						/>
						<Icon
							name="mdi:format-letter-case-lower"
							class="text-xl"
							:class="passwordOptions.includeLowercase.value
							? 'text-green-400'
							: 'text-zinc-600'"
						/>
						<Icon
							name="mdi:numeric"
							class="text-xl"
							:class="passwordOptions.includeNumbers.value
							? 'text-green-400'
							: 'text-zinc-600'"
						/>
						<Icon
							name="mdi:pound"
							class="text-xl"
							:class="passwordOptions.includeSymbols.value
							? 'text-green-400'
							: 'text-zinc-600'"
						/>
					</div>
				</div>
				<p class="text-xs text-zinc-500 mt-1">
					Each icon represents an included character type.
				</p>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-sm text-zinc-200">Password Length:</span>
				<span class="text-sm font-medium text-white">{{
						passwordOptions.length.value
					}}
					characters</span>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1">
					<span class="text-sm text-zinc-200">Security Level:</span>
					<span class="text-sm font-semibold" :class="securityLevelColor">
						{{ securityLevelText }}
					</span>
				</div>
				<div class="w-full bg-zinc-950/60 rounded-full h-3 border border-zinc-800 overflow-hidden">
					<div
						class="h-3 rounded-full transition-all duration-300"
						:class="[securityLevelBackgroundColor, securityLevelGlow]"
						:style="{ width: `${securityLevelWidth}%` }"
					>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
