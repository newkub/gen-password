import { createEffect, createSignal, Index, on, onCleanup, type Component } from "solid-js";
import { prefersReducedMotion } from "../lib/motion";

interface PasswordDisplayProps {
  value: string;
  onCopy: () => void;
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#$%&";
const STEP_MS = 18;
const HOLD_MS = 140;
const TICK_MS = 40;

export const PasswordDisplay: Component<PasswordDisplayProps> = (props) => {
  const [display, setDisplay] = createSignal(props.value);
  const timers = new Set<ReturnType<typeof setInterval>>();

  createEffect(
    on(
      () => props.value,
      (value) => {
        timers.forEach(clearInterval);
        timers.clear();
        if (!value || prefersReducedMotion()) {
          setDisplay(value);
          return;
        }
        const start = performance.now();
        const total = HOLD_MS + value.length * STEP_MS + 2 * TICK_MS;
        const timer = setInterval(() => {
          const elapsed = performance.now() - start;
          if (elapsed >= total) {
            setDisplay(value);
            clearInterval(timer);
            timers.delete(timer);
            return;
          }
          let out = "";
          for (let i = 0; i < value.length; i++) {
            out +=
              elapsed > i * STEP_MS + HOLD_MS
                ? value[i]
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
          setDisplay(out);
        }, TICK_MS);
        timers.add(timer);
      },
      { defer: true },
    ),
  );

  onCleanup(() => timers.forEach(clearInterval));

  return (
    <div
      class="pw-row font-code"
      role="button"
      tabindex="0"
      aria-label="Generate a new password and copy it"
      title="Click to generate & copy"
      onClick={() => props.onCopy()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          props.onCopy();
        }
      }}
    >
      <Index each={Array.from(display())}>
        {(char) => <span class="pw-char">{char()}</span>}
      </Index>
    </div>
  );
};
