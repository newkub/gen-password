import { createSignal, onCleanup, onMount, Show, type Component } from "solid-js";
import {
  CheckIcon,
  CopyIcon,
  EyeIcon,
  EyeOffIcon,
  RefreshIcon,
} from "./components/Icons";
import { PasswordDisplay } from "./components/PasswordDisplay";
import { copyText } from "./lib/clipboard";
import {
  CHARSETS,
  clampLength,
  countActiveCharsets,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  strengthOf,
  type CharsetKey,
  type PasswordOptions,
} from "./lib/password";

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 20,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
};

const CHARSET_LABELS: Record<CharsetKey, string> = {
  lower: "abc",
  upper: "ABC",
  digits: "123",
  symbols: "#!@",
};

const App: Component = () => {
  const [options, setOptions] = createSignal<PasswordOptions>(DEFAULT_OPTIONS);
  const [password, setPassword] = createSignal(generatePassword(DEFAULT_OPTIONS));
  const [copied, setCopied] = createSignal(false);
  const [hidden, setHidden] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  let resetTimer: ReturnType<typeof setTimeout> | undefined;

  const regenerate = () => {
    try {
      setPassword(generatePassword(options()));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not generate a password");
    }
  };

  const setLength = (length: number) => {
    const next = { ...options(), length: clampLength(length) };
    setOptions(next);
    regenerateWith(next);
  };

  const regenerateWith = (opts: PasswordOptions) => {
    try {
      setPassword(generatePassword(opts));
      setError(null);
    } catch {
      // keep the previous password; the toggle guard prevents this state
    }
  };

  const toggleCharset = (key: CharsetKey) => {
    const current = options();
    if (current[key] && countActiveCharsets(current) === 1) return;
    const next = { ...current, [key]: !current[key] };
    setOptions(next);
    regenerateWith(next);
  };

  const toggleAmbiguous = () => {
    const next = { ...options(), avoidAmbiguous: !options().avoidAmbiguous };
    setOptions(next);
    regenerateWith(next);
  };

  const copy = async () => {
    const ok = await copyText(password());
    if (!ok) {
      setError("Couldn't copy — select the password and press Ctrl+C");
      return;
    }
    setError(null);
    setCopied(true);
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

  const strength = () => strengthOf(options());

  return (
    <div class="min-h-dvh bg-[var(--color-bg)] text-[var(--color-ink)]">
      <main class="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-10 sm:px-6">
        <header class="mb-5">
          <h1 class="text-lg font-semibold tracking-tight">gen-password</h1>
          <p class="mt-0.5 text-sm text-[var(--color-muted)]">
            Strong random passwords, generated locally in your browser.
          </p>
        </header>

        <section class="rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface)] p-4 shadow-sm sm:p-5">
          <PasswordDisplay
            value={password()}
            hidden={hidden()}
            copied={copied()}
            onCopy={copy}
          />

          <div class="mt-3 flex items-center justify-between gap-3 text-xs text-[var(--color-muted)]">
            <div class="flex items-center gap-2">
              <span class="strength-track" aria-hidden="true">
                {([1, 2, 3, 4] as const).map((seg) => (
                  <span
                    class="strength-seg"
                    classList={{ [`on-${seg}`]: strength().score >= seg }}
                  />
                ))}
              </span>
              <span>
                {strength().label} · ~{Math.round(strength().bits)} bits
              </span>
            </div>
            <button
              type="button"
              class="btn-ghost -mr-2 inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-xs font-medium"
              aria-pressed={hidden()}
              aria-label={hidden() ? "Show password" : "Hide password"}
              onClick={() => setHidden((value) => !value)}
            >
              <Show when={hidden()} fallback={<EyeIcon class="h-3.5 w-3.5" />}>
                <EyeOffIcon class="h-3.5 w-3.5" />
              </Show>
              {hidden() ? "Show" : "Hide"}
            </button>
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-2">
            <div class="stepper" role="group" aria-label="Password length">
              <button
                type="button"
                aria-label="Decrease length"
                disabled={options().length <= MIN_LENGTH}
                onClick={() => setLength(options().length - 1)}
              >
                −
              </button>
              <output aria-live="polite">{options().length}</output>
              <button
                type="button"
                aria-label="Increase length"
                disabled={options().length >= MAX_LENGTH}
                onClick={() => setLength(options().length + 1)}
              >
                +
              </button>
            </div>

            <div class="flex flex-wrap items-center gap-1.5" role="group" aria-label="Character sets">
              {(Object.keys(CHARSETS) as CharsetKey[]).map((key) => (
                <button
                  type="button"
                  class="chip"
                  aria-pressed={options()[key]}
                  onClick={() => toggleCharset(key)}
                >
                  {CHARSET_LABELS[key]}
                </button>
              ))}
              <button
                type="button"
                class="chip"
                aria-pressed={options().avoidAmbiguous}
                title="Exclude ambiguous characters like l, 1, O, 0"
                onClick={toggleAmbiguous}
              >
                no 1lI0O
              </button>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-2">
            <button type="button" class="btn btn-secondary" onClick={regenerate}>
              <RefreshIcon class="h-4 w-4" />
              Regenerate
            </button>
            <button
              type="button"
              class="btn btn-primary"
              classList={{ "is-copied": copied() }}
              onClick={copy}
            >
              <Show when={copied()} fallback={<CopyIcon class="h-4 w-4" />}>
                <CheckIcon class="h-4 w-4" />
              </Show>
              {copied() ? "Copied" : "Copy"}
            </button>
          </div>

          <Show when={error()}>
            <p class="mt-3 text-center text-xs text-[var(--color-danger)]" aria-live="polite">
              {error()}
            </p>
          </Show>
        </section>

        <footer class="mt-4 text-center text-xs text-[var(--color-faint)]">
          Click the password to copy · Ctrl+Enter to regenerate · nothing leaves your device
        </footer>
      </main>
    </div>
  );
};

export default App;
