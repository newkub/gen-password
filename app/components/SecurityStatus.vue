<script setup lang="ts">
import { usePasswordOptionsStore } from "~/stores/password";

const {
	securityLevelColor,
	securityLevelText,
	securityLevelWidth,
	securityLevelBackgroundColor,
} = useSecurity();
const passwordOptions = usePasswordOptionsStore();
</script>

<template>
	<div class="bg-gray-800/50 rounded-lg p-5 border border-gray-700">
		<div class="flex items-center gap-3 mb-4">
			<Icon name="mdi:security" class="text-2xl text-blue-400" />
			<h3 class="font-semibold text-white text-lg">Security Analysis</h3>
		</div>
		<div class="space-y-4">
			<div>
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-300"
					>Character Types:</span>
					<div class="flex items-center space-x-2">
						<Icon
							name="mdi:format-letter-case-upper"
							class="text-xl"
							:class="passwordOptions.includeUppercase
							? 'text-green-400'
							: 'text-gray-600'"
						/>
						<Icon
							name="mdi:format-letter-case-lower"
							class="text-xl"
							:class="passwordOptions.includeLowercase
							? 'text-green-400'
							: 'text-gray-600'"
						/>
						<Icon
							name="mdi:numeric"
							class="text-xl"
							:class="passwordOptions.includeNumbers
							? 'text-green-400'
							: 'text-gray-600'"
						/>
						<Icon
							name="mdi:pound"
							class="text-xl"
							:class="passwordOptions.includeSymbols
							? 'text-green-400'
							: 'text-gray-600'"
						/>
					</div>
				</div>
				<p class="text-xs text-gray-500 mt-1">
					Each icon represents an included character type.
				</p>
			</div>

			<div class="flex items-center justify-between">
				<span class="text-sm text-gray-300">Password Length:</span>
				<span class="text-sm font-medium text-white">{{
						passwordOptions.length
					}}
					characters</span>
			</div>

			<div>
				<div class="flex items-center justify-between mb-1">
					<span class="text-sm text-gray-300">Security Level:</span>
					<span class="text-sm font-semibold" :class="securityLevelColor">
						{{ securityLevelText }}
					</span>
				</div>
				<div class="w-full bg-gray-700 rounded-full h-2.5">
					<div
						class="h-2.5 rounded-full transition-all duration-300"
						:class="securityLevelBackgroundColor"
						:style="{ width: `${securityLevelWidth}%` }"
					>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
