import { createEffect, Index, on, type Component } from "solid-js";
import { clearAnimations, prefersReducedMotion, replayAnimation } from "../lib/motion";

interface PasswordDisplayProps {
  value: string;
  copied: boolean;
  copyNonce: number;
  onCopy: () => void;
}

export const PasswordDisplay: Component<PasswordDisplayProps> = (props) => {
  const refs: (HTMLSpanElement | undefined)[] = [];
  const chars = () => Array.from(props.value);

  createEffect(
    on(
      () => props.value,
      (value) => {
        if (!value) return;
        if (prefersReducedMotion()) {
          clearAnimations(refs);
          return;
        }
        requestAnimationFrame(() => replayAnimation(refs, "pw-in", 22, 380));
      },
    ),
  );

  let seenNonce = 0;
  createEffect(() => {
    const nonce = props.copyNonce;
    if (nonce === seenNonce) return;
    seenNonce = nonce;
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() => replayAnimation(refs, "pw-pop", 12, 200));
  });

  return (
    <div
      class="pw-row font-code"
      classList={{ "is-copied": props.copied }}
      role="button"
      tabindex="0"
      aria-label="Copy password to clipboard"
      title="Click to copy"
      onClick={() => props.onCopy()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          props.onCopy();
        }
      }}
    >
      <Index each={chars()}>
        {(char, index) => (
          <span
            ref={(element) => {
              refs[index] = element;
            }}
            class="pw-char"
          >
            {char()}
          </span>
        )}
      </Index>
    </div>
  );
};
