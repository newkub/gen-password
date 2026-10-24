import { createSignal, onCleanup, onMount, Show, type Component } from "solid-js";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  RefreshIcon,
} from "./components/Icons";
import { PasswordDisplay } from "./components/PasswordDisplay";
import { copyText } from "./lib/clipboard";
import { prefersReducedMotion } from "./lib/motion";
import { generatePassword, type PasswordOptions } from "./lib/password";

const OPTIONS: PasswordOptions = {
  length: 20,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
};

const App: Component = () => {
  const [password, setPassword] = createSignal(generatePassword(OPTIONS));
  const [copied, setCopied] = createSignal(false);
  const [copyNonce, setCopyNonce] = createSignal(0);
  const [hidden, setHidden] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let genIcon: HTMLSpanElement | undefined;

  const regenerate = () => {
    setPassword(generatePassword(OPTIONS));
    setError(null);
    if (genIcon && !prefersReducedMotion()) {
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
    <div class="relative flex min-h-dvh flex-col bg-ink-950 text-mist-100">
      <div class="bg-scene" aria-hidden="true">
        <span class="orb orb-violet" />
        <span class="orb orb-mint" />
        <span class="orb orb-sky" />
        <span class="bg-grid" />
        <span class="bg-vignette" />
        <span class="bg-noise" />
      </div>

      <main class="relative z-10 mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-6 py-12">
        <header class="mb-10 flex items-center gap-3">
          <span class="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-forge-violet">
            <KeyIcon class="h-4.5 w-4.5" />
          </span>
          <span class="leading-tight">
            <span class="block text-sm font-semibold tracking-tight">gen-password</span>
            <span class="block text-[11px] text-mist-500">local · offline · secure</span>
          </span>
        </header>

        <PasswordDisplay
          value={password()}
          hidden={hidden()}
          copied={copied()}
          copyNonce={copyNonce()}
          onCopy={copy}
        />

        <div class="mt-4 flex items-center justify-between gap-3">
          <p class="text-xs text-mist-500">20 characters · lowercase, uppercase, digits, symbols</p>
          <button
            type="button"
            class="shrink-0 rounded-lg p-2 text-mist-500 transition hover:bg-white/5 hover:text-mist-100"
            aria-pressed={hidden()}
            aria-label={hidden() ? "Show password" : "Hide password"}
            title={hidden() ? "Show password" : "Hide password"}
            onClick={() => setHidden((value) => !value)}
          >
            <Show when={hidden()} fallback={<EyeIcon class="h-4 w-4" />}>
              <EyeOffIcon class="h-4 w-4" />
            </Show>
          </button>
        </div>

        <div class="mt-9 flex flex-col gap-3">
          <button type="button" class="btn-primary w-full" onClick={regenerate}>
            <span ref={(element) => (genIcon = element)} class="inline-flex">
              <RefreshIcon class="h-5 w-5" />
            </span>
            Random
          </button>
          <button type="button" class="btn-secondary w-full" classList={{ "is-copied": copied() }} onClick={copy}>
            <Show when={copied()} fallback={<CopyIcon class="h-5 w-5" />}>
              <CheckIcon class="h-5 w-5" />
            </Show>
            {copied() ? "Copied" : "Copy"}
          </button>
        </div>

        <Show when={error()}>
          <p class="mt-3 text-center text-xs text-forge-coral" aria-live="polite">
            {error()}
          </p>
        </Show>

        <p class="mt-10 text-center text-[11px] text-mist-500">
          Click the password to copy ·{" "}
          <kbd class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-code text-[10px] text-mist-300">Ctrl</kbd>
          {" + "}
          <kbd class="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-code text-[10px] text-mist-300">Enter</kbd>{" "}
          for a new one
        </p>
      </main>
    </div>
  );
};

export default App;
