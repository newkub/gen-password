import type { Component } from "solid-js";

interface PasswordDisplayProps {
  value: string;
  hidden: boolean;
  copied: boolean;
  onCopy: () => void;
}

export const PasswordDisplay: Component<PasswordDisplayProps> = (props) => (
  <div
    class="pw-box font-code"
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
    {props.hidden ? "•".repeat(props.value.length) : props.value}
  </div>
);
