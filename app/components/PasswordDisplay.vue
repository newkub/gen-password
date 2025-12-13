<script setup lang="ts">
const props = defineProps<{
	displayPassword: string;
	copied: boolean;
	isRegenerating: boolean;
}>();

const emit = defineEmits(["generateAndCopy"]);
</script>

<template>
	<div class="w-full bg-gray-800/50 rounded-lg p-5 border border-gray-700">
		<div class="flex items-center gap-3 mb-5">
			<Icon name="mdi:form-textbox-password" class="text-2xl text-blue-400" />
			<h2 class="text-xl font-bold text-white">Generated Password</h2>
		</div>
		<div>
			<div class="bg-gray-900 border-2 border-dashed border-gray-700 rounded-lg p-4 mb-4 min-h-[64px] flex items-center justify-center">
				<p class="text-xl font-mono break-all text-gray-300 text-center">
					{{ displayPassword || "..." }}
				</p>
			</div>
			<button
				@click="emit('generateAndCopy')"
				:disabled="isRegenerating"
				class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer transform hover:scale-105"
			>
				<Icon
					v-if="isRegenerating"
					name="mdi:loading"
					class="animate-spin text-2xl"
				/>
				<Icon
					v-else-if="copied"
					name="mdi:check-circle"
					class="text-2xl text-green-300"
				/>
				<Icon v-else name="mdi:flash" class="text-2xl" />
				<span class="text-lg">{{ isRegenerating ? "Generating..." : (copied ? "Copied!" : "Generate & Copy") }}</span>
			</button>
		</div>
	</div>
</template>
