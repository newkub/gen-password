import { createEffect, Index, on, type Component } from "solid-js";
import { clearAnimations, prefersReducedMotion, replayAnimation } from "../lib/motion";

interface PasswordDisplayProps {
  value: string;
  hidden: boolean;
  copied: boolean;
  copyNonce: number;
  onCopy: () => void;
}

type CharKind = "letter" | "digit" | "symbol";

interface CharToken {
  ch: string;
  kind: CharKind;
}

function tokenize(value: string): CharToken[] {
  return Array.from(value, (ch) => ({
    ch,
    kind: /\d/.test(ch) ? "digit" : /[a-z]/i.test(ch) ? "letter" : "symbol",
  }));
}

export const PasswordDisplay: Component<PasswordDisplayProps> = (props) => {
  const refs: (HTMLSpanElement | undefined)[] = [];
  const tokens = () => tokenize(props.value);

  createEffect(
    on(
      () => props.value,
      (value) => {
        if (!value) return;
        if (prefersReducedMotion()) {
          clearAnimations(refs);
          return;
        }
        requestAnimationFrame(() => replayAnimation(refs, "flip", 22, 420));
      },
    ),
  );

  let seenNonce = 0;
  createEffect(() => {
    const nonce = props.copyNonce;
    if (nonce === seenNonce) return;
    seenNonce = nonce;
    if (prefersReducedMotion()) return;
    requestAnimationFrame(() => replayAnimation(refs, "wave", 18, 360));
  });

  return (
    <div
      class="pw-row font-code select-none"
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
      <Index each={tokens()}>
        {(token, index) => (
          <span
            ref={(element) => {
              refs[index] = element;
            }}
            class="pw-char"
            classList={{
              "pw-digit": token().kind === "digit",
              "pw-symbol": token().kind === "symbol",
              "pw-done": props.copied,
            }}
          >
            {props.hidden ? "•" : token().ch}
          </span>
        )}
      </Index>
    </div>
  );
};
