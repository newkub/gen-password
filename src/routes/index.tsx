import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { Show } from "solid-js";
import { createFileRoute } from "@tanstack/solid-router";

import {
	copyToClipboard,
	createRandomPassword,
	getFullCharacterSet,
} from "~/lib/password";

export const Route = createFileRoute("/")({
	component: PasswordGenerator,
});

const CHARACTER_SET = getFullCharacterSet();

function PasswordGenerator() {
	const [length, setLength] = createSignal(16);
	const [isRegenerating, setIsRegenerating] = createSignal(false);
	const [displayPassword, setDisplayPassword] = createSignal("");
	const [copied, setCopied] = createSignal(false);
	let animationInterval: ReturnType<typeof setInterval> | null = null;

	const generateWithAnimation = () => {
		setIsRegenerating(true);
		const previousPassword = displayPassword() || "";
		let counter = 0;
		const characters = CHARACTER_SET;

		if (animationInterval) clearInterval(animationInterval);

		animationInterval = setInterval(() => {
			let tempPassword = "";
			const targetLength = previousPassword.length || length();
			for (let i = 0; i < targetLength; i++) {
				tempPassword += characters.charAt(
					Math.floor(Math.random() * characters.length),
				);
			}
			setDisplayPassword(tempPassword);
			counter++;

			if (counter > 10) {
				if (animationInterval) clearInterval(animationInterval);
				const finalPassword = createRandomPassword(length());
				setDisplayPassword(finalPassword);
				void copyToClipboard(finalPassword).then((success) => {
					if (success) {
						setCopied(true);
						setTimeout(() => setCopied(false), 1200);
					}
				});
				setIsRegenerating(false);
			}
		}, 30);
	};

	onMount(() => {
		generateWithAnimation();
	});

	onCleanup(() => {
		if (animationInterval) clearInterval(animationInterval);
	});

	createEffect(() => {
		// Watch length changes and regenerate
		length();
		// Only regenerate after mount (createEffect runs client-side only in Solid)
		generateWithAnimation();
	});

	return (
		<div class="min-h-full flex items-center justify-center p-0 text-zinc-100">
			<div class="w-11/12 md:w-11/12 max-w-6xl bg-transparent rounded-2xl shadow-lg overflow-y-auto border border-zinc-800/80">
				<div class="p-6 text-center">
					<div class="flex items-center justify-center gap-3">
						<span class="i-mdi-shield-lock text-4xl text-blue-400" />
						<h1 class="text-3xl font-bold">Password Generator</h1>
					</div>
					<p class="text-zinc-300 text-sm mt-2">
						Create strong, secure, and random passwords
					</p>
				</div>

				<div class="p-5 space-y-6">
					<div
						class="rounded-2xl border border-zinc-800/80 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 p-8 md:p-12 cursor-pointer"
						onClick={() => generateWithAnimation()}
					>
						<div class="flex items-center justify-between gap-4">
							<div class="text-sm text-zinc-300">
								<Show when={copied()} fallback="Click to randomize & copy">
									Copied
								</Show>
							</div>
							<div class="text-xs text-zinc-400">
								Length {length()}/32
							</div>
						</div>

						<div
							class="mt-7 w-full text-center font-mono text-8xl md:text-[12rem] tracking-wider break-all select-all"
							classList={{
								"opacity-70": isRegenerating(),
								"opacity-100": !isRegenerating(),
							}}
						>
							<span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-blue-400 to-violet-400 drop-shadow">
								{displayPassword()}
							</span>
						</div>

						<div class="mt-16 grid gap-2">
							<input
								type="range"
								id="length"
								min="0"
								max="32"
								value={length()}
								onInput={(e) => setLength(Number(e.currentTarget.value))}
								class="w-full h-1 bg-zinc-900/60 rounded-lg appearance-none cursor-pointer accent-zinc-400"
							/>
							<div class="text-[11px] text-zinc-600 text-center">0 / 32</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
