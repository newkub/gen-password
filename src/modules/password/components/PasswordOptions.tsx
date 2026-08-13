import { usePasswordOptions } from "~/modules/password/hooks/usePasswordOptions";

const MIN_PASSWORD_LENGTH = 16;

export function PasswordOptions() {
	const opts = usePasswordOptions();

	const setLengthValue = (value: number) => {
		opts.setLength(Math.max(value, MIN_PASSWORD_LENGTH));
	};

	return (
		<div class="w-full bg-zinc-800/40 rounded-lg p-5 border border-zinc-700/70">
			<div class="flex items-center gap-3 mb-5">
				<span class="i-mdi-cogs text-2xl text-blue-400" />
				<h2 class="text-xl font-bold text-white">Password Options</h2>
			</div>

			{/* Length Control */}
			<div class="mb-6">
				<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
					<label class="text-base font-semibold text-zinc-200">
						Password Length
					</label>
					<input
						type="number"
						min={MIN_PASSWORD_LENGTH}
						max="50"
						value={opts.length()}
						onInput={(e) => setLengthValue(Number(e.currentTarget.value))}
						class="w-24 text-lg font-bold text-blue-400 bg-zinc-900/80 px-3 py-1.5 rounded-md border border-zinc-700/70 text-center"
					/>
				</div>
				<div class="space-y-3">
					<input
						type="range"
						min="0"
						max="50"
						value={opts.length()}
						onInput={(e) => setLengthValue(Number(e.currentTarget.value))}
						class="w-full h-3 bg-zinc-700 rounded-full appearance-none cursor-pointer accent-blue-500"
					/>
					<div class="flex justify-between text-sm text-zinc-500">
						<span>0</span>
						<span>50</span>
					</div>
				</div>
			</div>

			{/* Character Types */}
			<div>
				<h3 class="text-base font-semibold text-zinc-200 mb-2">
					Character Types
				</h3>
				<p class="text-xs text-zinc-500 mb-4">
					Select the character types to include in your password.
				</p>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					<button
						onClick={() => opts.setIncludeUppercase(!opts.includeUppercase())}
						class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
						classList={{
							"bg-blue-500/20 border-blue-500 text-white": opts.includeUppercase(),
							"bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60":
								!opts.includeUppercase(),
						}}
					>
						<span class="i-mdi-format-letter-case-upper text-2xl mr-3" />
						<div>
							<div class="font-medium">Uppercase</div>
							<div class="text-sm text-zinc-400">(A-Z)</div>
						</div>
					</button>
					<button
						onClick={() => opts.setIncludeLowercase(!opts.includeLowercase())}
						class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
						classList={{
							"bg-blue-500/20 border-blue-500 text-white": opts.includeLowercase(),
							"bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60":
								!opts.includeLowercase(),
						}}
					>
						<span class="i-mdi-format-letter-case-lower text-2xl mr-3" />
						<div>
							<div class="font-medium">Lowercase</div>
							<div class="text-sm text-zinc-400">(a-z)</div>
						</div>
					</button>
					<button
						onClick={() => opts.setIncludeNumbers(!opts.includeNumbers())}
						class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
						classList={{
							"bg-blue-500/20 border-blue-500 text-white": opts.includeNumbers(),
							"bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60":
								!opts.includeNumbers(),
						}}
					>
						<span class="i-mdi-numeric text-2xl mr-3" />
						<div>
							<div class="font-medium">Numbers</div>
							<div class="text-sm text-zinc-400">(0-9)</div>
						</div>
					</button>
					<button
						onClick={() => opts.setIncludeSymbols(!opts.includeSymbols())}
						class="p-3 rounded-lg border transition-all duration-200 text-left flex items-center cursor-pointer"
						classList={{
							"bg-blue-500/20 border-blue-500 text-white": opts.includeSymbols(),
							"bg-zinc-700/40 border-zinc-600/80 text-zinc-200 hover:bg-zinc-700/60":
								!opts.includeSymbols(),
						}}
					>
						<span class="i-mdi-pound text-2xl mr-3" />
						<div>
							<div class="font-medium">Symbols</div>
							<div class="text-sm text-zinc-400">(!@#$%)</div>
						</div>
					</button>
				</div>
			</div>
		</div>
	);
}
