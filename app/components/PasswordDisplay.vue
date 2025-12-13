<script setup lang="ts">
const props = defineProps<{
	displayPassword: string;
	copied: boolean;
	isRegenerating: boolean;
}>();

const emit = defineEmits(["copy", "regenerate"]);
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
			<div class="flex flex-col sm:flex-row gap-3">
				<button
					@click="emit('copy')"
					class="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 w-full cursor-pointer"
				>
					<Icon v-if="copied" name="mdi:check-circle" class="text-xl" />
					<Icon v-else name="mdi:content-copy" class="text-xl" />
					<span>{{ copied ? "Copied!" : "Copy Password" }}</span>
				</button>
				<button
					@click="emit('regenerate')"
					:disabled="isRegenerating"
					class="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
				>
					<Icon
						v-if="isRegenerating"
						name="mdi:loading"
						class="animate-spin text-xl"
					/>
					<Icon v-else name="mdi:refresh" class="text-xl" />
					<span>{{ isRegenerating ? "Generating..." : "Regenerate" }}</span>
				</button>
			</div>
		</div>
	</div>
</template>
