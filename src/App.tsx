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
      <div
        class="pointer-events-none fixed inset-x-0 top-0 h-[30rem] bg-[radial-gradient(60%_50%_at_50%_0%,rgba(167,139,250,0.12),transparent_70%)]"
        aria-hidden="true"
      />

      <main class="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-5 py-12">
        <header class="mb-6 flex items-center gap-2">
          <KeyIcon class="h-4.5 w-4.5 text-forge-violet" />
          <span class="text-sm font-semibold tracking-tight">gen-password</span>
        </header>

        <section class="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
          <div class="flex items-start gap-2">
            <div class="min-h-16 min-w-0 flex-1">
              <PasswordDisplay
                value={password()}
                hidden={hidden()}
                copied={copied()}
                copyNonce={copyNonce()}
                onCopy={copy}
              />
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-mist-500 transition hover:bg-white/5 hover:text-mist-200"
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

          <div class="mt-6 grid grid-cols-2 gap-2">
            <button type="button" class="copy-button" onClick={copy}>
              <Show when={copied()} fallback={<CopyIcon class="h-4 w-4" />}>
                <CheckIcon class="h-4 w-4" />
              </Show>
              {copied() ? "Copied" : "Copy"}
            </button>
            <button type="button" class="gen-button" onClick={regenerate}>
              <span ref={(element) => (genIcon = element)} class="inline-flex">
                <RefreshIcon class="h-4 w-4" />
              </span>
              Random
            </button>
          </div>

          <Show when={error()}>
            <p class="mt-2 text-center text-[11px] text-forge-coral" aria-live="polite">
              {error()}
            </p>
          </Show>
        </section>
      </main>
    </div>
  );
};

export default App;
