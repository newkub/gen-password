import { Show } from "solid-js";

interface PasswordDisplayProps {
	displayPassword: string;
	copied: boolean;
	isRegenerating: boolean;
	onGenerateAndCopy: () => void;
	onCopy: () => void;
}

export function PasswordDisplay(props: PasswordDisplayProps) {
	return (
		<div class="w-full bg-zinc-800/40 rounded-lg p-4 border border-zinc-700/70">
			<div class="flex items-center gap-3 mb-5">
				<span class="i-mdi-form-textbox-password text-2xl text-blue-400" />
				<h2 class="text-xl font-bold text-white">Generated Password</h2>
			</div>
			<div>
				<div
					class="group relative bg-zinc-900/80 border-2 border-dashed border-zinc-700/70 rounded-lg p-3 mb-4 min-h-[52px] flex items-center justify-center transition-colors"
					classList={{
						"cursor-pointer hover:border-blue-500/70":
							!!props.displayPassword && !props.isRegenerating,
						"cursor-default": !props.displayPassword || props.isRegenerating,
					}}
					onClick={() => {
						if (props.displayPassword && !props.isRegenerating) {
							props.onCopy();
						}
					}}
				>
					<p class="text-xl font-mono break-all text-zinc-200 text-center">
						{props.displayPassword || "..."}
					</p>
					<Show when={props.displayPassword && !props.isRegenerating}>
						<div class="absolute inset-x-0 bottom-1 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
							<span class="text-[11px] text-zinc-400">Click to copy</span>
						</div>
					</Show>
				</div>
				<button
					onClick={() => props.onGenerateAndCopy()}
					disabled={props.isRegenerating}
					class="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
				>
					<Show
						when={props.isRegenerating}
						fallback={
							<Show
								when={props.copied}
								fallback={<span class="i-mdi-flash text-2xl" />}
							>
								<span class="i-mdi-check-circle text-2xl text-green-300" />
							</Show>
						}
					>
						<span class="i-mdi-loading animate-spin text-2xl" />
					</Show>
					<span class="text-lg">
						{props.isRegenerating
							? "Generating..."
							: props.copied
								? "Copied!"
								: props.displayPassword
									? "Regenerate & Copy"
									: "Generate & Copy"}
					</span>
				</button>
			</div>
		</div>
	);
}
