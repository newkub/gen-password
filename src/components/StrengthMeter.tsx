import { For, type Component } from "solid-js";
import type { Strength } from "../lib/password";

const TONES = {
  1: { bar: "bg-forge-coral", text: "text-forge-coral" },
  2: { bar: "bg-forge-amber", text: "text-forge-amber" },
  3: { bar: "bg-forge-sky", text: "text-forge-sky" },
  4: { bar: "bg-forge-mint", text: "text-forge-mint" },
} as const;

const STEPS = [1, 2, 3, 4] as const;

export const StrengthMeter: Component<{ strength: Strength }> = (props) => {
  const tone = () => TONES[props.strength.score];

  return (
    <div>
      <div class="flex items-center justify-between gap-3 text-xs">
        <span class="text-mist-400">Strength</span>
        <span class={tone().text}>
          {props.strength.label}
          <span class="text-mist-400"> · ~{Math.round(props.strength.bits)} bits</span>
        </span>
      </div>
      <div class="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
        <For each={STEPS}>
          {(step) => (
            <span
              class="h-1.5 rounded-full transition-all duration-500"
              classList={{
                [tone().bar]: step <= props.strength.score,
                "bg-white/8": step > props.strength.score,
              }}
            />
          )}
        </For>
      </div>
    </div>
  );
};
