import { createSignal, onCleanup, onMount, Show, type Component } from "solid-js";
import {
  CheckIcon,
  CopyIcon,
  RefreshIcon,
} from "./components/Icons";
import { PasswordDisplay } from "./components/PasswordDisplay";
import { copyText } from "./lib/clipboard";
import { generatePassword } from "./lib/password";

const OPTIONS = {
  length: 24,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
} as const;

const App: Component = () => {
  const [password, setPassword] = createSignal("");
  const [copied, setCopied] = createSignal(false);
  const [copyNonce, setCopyNonce] = createSignal(0);
  const [error, setError] = createSignal<string | null>(null);

  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let genIcon: HTMLSpanElement | undefined;

  const regenerate = () => {
    setPassword(generatePassword(OPTIONS));
    setError(null);
    if (genIcon) {
      genIcon.classList.remove("turn");
      void genIcon.offsetWidth;
      genIcon.classList.add("turn");
    }
  };

  const copy = async () => {
    const ok = await copyText(password());
    if (!ok) {
      setError("Couldn't copy — select the password and press Ctrl+C");
      return;
    }
    setError(null);
    setCopied(true);
    setCopyNonce((nonce) => nonce + 1);
    navigator.vibrate?.(15);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => setCopied(false), 2000);
  };

  onMount(() => {
    regenerate();
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        regenerate();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });

  onCleanup(() => clearTimeout(resetTimer));

  return (
    <div class="relative flex min-h-dvh flex-col overflow-hidden bg-[var(--color-bg)] text-[var(--color-ink)]">
      <div class="bg-scene" aria-hidden="true">
        <span class="orb orb-a" />
        <span class="orb orb-b" />
      </div>

      <main class="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p class="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
          gen-password
        </p>

        <PasswordDisplay
          value={password()}
          copied={copied()}
          copyNonce={copyNonce()}
          onCopy={copy}
        />

        <p class="mt-4 text-sm text-[var(--color-faint)]">
          {OPTIONS.length} characters · click to copy
        </p>

        <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button type="button" class="btn btn-secondary px-6" onClick={regenerate}>
            <span ref={(element) => (genIcon = element)} class="inline-flex">
              <RefreshIcon class="h-5 w-5" />
            </span>
            Random
          </button>
          <button
            type="button"
            class="btn btn-primary px-8"
            classList={{ "is-copied": copied() }}
            onClick={copy}
          >
            <Show when={copied()} fallback={<CopyIcon class="h-5 w-5" />}>
              <CheckIcon class="h-5 w-5" />
            </Show>
            {copied() ? "Copied" : "Copy"}
          </button>
        </div>

        <Show when={error()}>
          <p class="mt-4 text-sm text-[var(--color-danger)]" aria-live="polite">
            {error()}
          </p>
        </Show>

        <footer class="mt-16 text-xs text-[var(--color-faint)]">
          Cryptographically random · generated locally · Ctrl+Enter to regenerate
        </footer>
      </main>
    </div>
  );
};

export default App;
