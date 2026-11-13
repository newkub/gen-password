import { createEffect, createSignal, For, onCleanup, type Component } from "solid-js";
import { prefersReducedMotion } from "../lib/motion";

interface PasswordDisplayProps {
  value: string;
  onCopy: () => void;
}

const REEL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
const TICK_MS = 50;
const HOLD_MS = 220;
const STAGGER_MS = 55;
const JITTER_MS = 140;

interface Cell {
  char: string;
  settled: boolean;
}

const settledCells = (value: string): Cell[] =>
  Array.from(value, (char) => ({ char, settled: true }));

export const PasswordDisplay: Component<PasswordDisplayProps> = (props) => {
  const [cells, setCells] = createSignal<Cell[]>(settledCells(props.value));
  const timers = new Set<ReturnType<typeof setInterval>>();

  createEffect(() => {
    const value = props.value;
    timers.forEach(clearInterval);
    timers.clear();
    if (!value || prefersReducedMotion()) {
      setCells(settledCells(value));
      return;
    }

    // Lottery draw: each position locks in at its own random moment.
    const order = Array.from({ length: value.length }, (_, i) => i);
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j]!, order[i]!];
    }
    const settleAt = new Array<number>(value.length).fill(0);
    order.forEach((charIndex, position) => {
      settleAt[charIndex] = HOLD_MS + position * STAGGER_MS + Math.random() * JITTER_MS;
    });
    const total = Math.max(...settleAt) + TICK_MS;

    const start = performance.now();
    const timer = setInterval(() => {
      const elapsed = performance.now() - start;
      if (elapsed >= total) {
        setCells(settledCells(value));
        clearInterval(timer);
        timers.delete(timer);
        return;
      }
      setCells(
        value.split("").map((char, i) =>
          elapsed >= settleAt[i]!
            ? { char, settled: true }
            : { char: REEL[Math.floor(Math.random() * REEL.length)]!, settled: false },
        ),
      );
    }, TICK_MS);
    timers.add(timer);
  });

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
      <For each={cells()}>
        {(cell) => (
          <span class={cell.settled ? "pw-char is-settled" : "pw-char is-rolling"}>
            {cell.char}
          </span>
        )}
      </For>
    </div>
  );
};
