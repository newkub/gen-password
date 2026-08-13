import { usePasswordOptions } from "~/modules/password/hooks/usePasswordOptions";
import { useSecurity } from "~/modules/password/hooks/useSecurity";

export function SecurityStatus() {
	const opts = usePasswordOptions();
	const {
		securityLevelColor,
		securityLevelText,
		securityLevelWidth,
		securityLevelBackgroundColor,
		securityLevelGlow,
	} = useSecurity();

	return (
		<div class="bg-zinc-800/40 rounded-lg p-5 border border-zinc-700/70">
			<div class="flex items-center gap-3 mb-4">
				<span class="i-mdi-security text-2xl text-blue-400" />
				<h3 class="font-semibold text-white text-lg">Security Analysis</h3>
			</div>
			<div class="space-y-4">
				<div>
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium text-zinc-200">
							Character Types:
						</span>
						<div class="flex items-center space-x-2">
							<span
								class="i-mdi-format-letter-case-upper text-xl"
								classList={{
									"text-green-400": opts.includeUppercase(),
									"text-zinc-600": !opts.includeUppercase(),
								}}
							/>
							<span
								class="i-mdi-format-letter-case-lower text-xl"
								classList={{
									"text-green-400": opts.includeLowercase(),
									"text-zinc-600": !opts.includeLowercase(),
								}}
							/>
							<span
								class="i-mdi-numeric text-xl"
								classList={{
									"text-green-400": opts.includeNumbers(),
									"text-zinc-600": !opts.includeNumbers(),
								}}
							/>
							<span
								class="i-mdi-pound text-xl"
								classList={{
									"text-green-400": opts.includeSymbols(),
									"text-zinc-600": !opts.includeSymbols(),
								}}
							/>
						</div>
					</div>
					<p class="text-xs text-zinc-500 mt-1">
						Each icon represents an included character type.
					</p>
				</div>

				<div class="flex items-center justify-between">
					<span class="text-sm text-zinc-200">Password Length:</span>
					<span class="text-sm font-medium text-white">
						{opts.length()} characters
					</span>
				</div>

				<div>
					<div class="flex items-center justify-between mb-1">
						<span class="text-sm text-zinc-200">Security Level:</span>
						<span class={`text-sm font-semibold ${securityLevelColor()}`}>
							{securityLevelText()}
						</span>
					</div>
					<div class="w-full bg-zinc-950/60 rounded-full h-3 border border-zinc-800 overflow-hidden">
						<div
							class={`h-3 rounded-full transition-all duration-300 ${securityLevelBackgroundColor()} ${securityLevelGlow()}`}
							style={{ width: `${securityLevelWidth()}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
