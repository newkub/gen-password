import { createEffect, on, onCleanup, type Component } from "solid-js";
import { prefersReducedMotion } from "../lib/motion";

interface PasswordDisplayProps {
  value: string;
  onCopy: () => void;
}

const GLYPHS = "!<>-_\\/[]{}=+*^?#$%&";

export const PasswordDisplay: Component<PasswordDisplayProps> = (props) => {
  const refs: (HTMLSpanElement | undefined)[] = [];
  const chars = () => Array.from(props.value);
  let timers: ReturnType<typeof setInterval>[] = [];

  createEffect(
    on(
      () => props.value,
      (value) => {
        timers.forEach(clearInterval);
        timers = [];
        const elements = Array.from(refs);
        if (!value || prefersReducedMotion()) {
          elements.forEach((el, i) => {
            if (el) el.textContent = value[i] ?? "";
          });
          return;
        }
        elements.forEach((el, i) => {
          if (!el) return;
          const finalChar = value[i] ?? "";
          const delay = i * 18;
          const duration = 420 + i * 8;
          const start = performance.now() + delay;
          const timer = setInterval(() => {
            const elapsed = performance.now() - start;
            if (elapsed < 0) return;
            if (elapsed >= duration) {
              el.textContent = finalChar;
              clearInterval(timer);
              return;
            }
            el.textContent =
              Math.random() < 0.45
                ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
                : finalChar;
          }, 34);
          timers.push(timer);
        });
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
      {chars().map((_, index) => (
        <span
          class="pw-char"
          ref={(element) => {
            refs[index] = element;
          }}
        />
      ))}
    </div>
  );
};
