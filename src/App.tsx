import {
  createEffect,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  type Component,
} from "solid-js";
import { createStore } from "solid-js/store";
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
import {
  countActiveCharsets,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  strengthOf,
  type CharsetKey,
  type PasswordOptions,
} from "./lib/password";

const CHARSET_FIELDS = [
  { key: "upper", label: "A–Z" },
  { key: "lower", label: "a–z" },
  { key: "digits", label: "0–9" },
  { key: "symbols", label: "!@#" },
] as const satisfies ReadonlyArray<{ key: CharsetKey; label: string }>;

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 20,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
};

type Status = { text: string; tone: "ok" | "error" };

const STRENGTH_COLORS = {
  1: "text-forge-coral",
  2: "text-forge-amber",
  3: "text-forge-sky",
  4: "text-forge-mint",
} as const;

const App: Component = () => {
  const [options, setOptions] = createStore<PasswordOptions>({ ...DEFAULT_OPTIONS });
  const [password, setPassword] = createSignal("");
  const [copied, setCopied] = createSignal(false);
  const [copyNonce, setCopyNonce] = createSignal(0);
  const [hidden, setHidden] = createSignal(false);
  const [status, setStatus] = createSignal<Status | null>(null);

  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  let genIcon: HTMLSpanElement | undefined;

  const snapshot = (): PasswordOptions => ({
    length: options.length,
    lower: options.lower,
    upper: options.upper,
    digits: options.digits,
    symbols: options.symbols,
    avoidAmbiguous: options.avoidAmbiguous,
  });

  const activeCount = () => countActiveCharsets(options);
  const strength = () => strengthOf(options);
  const lengthPercent = () =>
    ((options.length - MIN_LENGTH) / (MAX_LENGTH - MIN_LENGTH)) * 100;

  const regenerate = (animateButton: boolean) => {
    try {
      setPassword(generatePassword(snapshot()));
    } catch {
      setStatus({ text: "Pick at least one character type", tone: "error" });
      return;
    }
    if (animateButton && genIcon && !prefersReducedMotion()) {
      genIcon.classList.remove("turn");
      void genIcon.offsetWidth;
      genIcon.classList.add("turn");
    }
  };

  createEffect(() => {
    try {
      setPassword(generatePassword(snapshot()));
    } catch {
      setStatus({ text: "Pick at least one character type", tone: "error" });
    }
  });

  const copy = async () => {
    const value = password();
    if (!value) return;
    const ok = await copyText(value);
    if (!ok) {
      setStatus({
        text: "Couldn't copy — select the password and press Ctrl+C",
        tone: "error",
      });
      return;
    }
    setCopied(true);
    setCopyNonce((nonce) => nonce + 1);
    setStatus({ text: "Copied to clipboard", tone: "ok" });
    navigator.vibrate?.(15);
    clearTimeout(resetTimer);
    resetTimer = setTimeout(() => {
      setCopied(false);
      setStatus(null);
    }, 2000);
  };

  const toggleCharset = (key: CharsetKey) => {
    if (options[key] && activeCount() === 1) return;
    setOptions(key, (enabled) => !enabled);
  };

  onMount(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        regenerate(true);
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

      <main class="relative mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-6 px-5 py-12">
        <header class="flex items-center gap-2">
          <KeyIcon class="h-4.5 w-4.5 text-forge-violet" />
          <span class="text-sm font-semibold tracking-tight">Passforge</span>
          <span class="ml-auto text-[11px] text-mist-500">offline</span>
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

          <div class="mt-3 flex items-center justify-between text-[11px] text-mist-500">
            <span class={STRENGTH_COLORS[strength().score]}>
              {strength().label}
              <span class="text-mist-500"> · ~{Math.round(strength().bits)} bits</span>
            </span>
            <span class="font-mono">{options.length} chars</span>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-2">
            <button type="button" class="copy-button" onClick={copy}>
              <Show when={copied()} fallback={<CopyIcon class="h-4 w-4" />}>
                <CheckIcon class="h-4 w-4" />
              </Show>
              {copied() ? "Copied" : "Copy"}
            </button>
            <button type="button" class="gen-button" onClick={() => regenerate(true)}>
              <span ref={(element) => (genIcon = element)} class="inline-flex">
                <RefreshIcon class="h-4 w-4" />
              </span>
              Generate
            </button>
          </div>

          <div class="mt-2 h-4 text-center text-[11px] leading-4" aria-live="polite">
            <Show when={status()}>
              {(current) => (
                <span
                  classList={{
                    "text-forge-mint": current().tone === "ok",
                    "text-forge-coral": current().tone === "error",
                  }}
                >
                  {current().text}
                </span>
              )}
            </Show>
          </div>
        </section>

        <section class="grid gap-5">
          <div>
            <div class="flex items-center justify-between text-[11px] text-mist-500">
              <label for="length">Length</label>
              <span class="font-mono tabular-nums text-mist-300">{options.length}</span>
            </div>
            <input
              id="length"
              class="range mt-2"
              type="range"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              step="1"
              value={options.length}
              style={{ "--fill": `${lengthPercent()}%` }}
              onInput={(event) =>
                setOptions("length", Number(event.currentTarget.value))
              }
            />
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <For each={CHARSET_FIELDS}>
              {(charset) => {
                const enabled = () => options[charset.key];
                const locked = () => enabled() && activeCount() === 1;
                return (
                  <button
                    type="button"
                    class="rounded-lg border px-3 py-1.5 font-mono text-[11px] transition disabled:cursor-not-allowed disabled:opacity-40"
                    classList={{
                      "border-forge-violet/40 bg-forge-violet/10 text-mist-100":
                        enabled(),
                      "border-white/8 text-mist-500 hover:border-white/15 hover:text-mist-300":
                        !enabled(),
                    }}
                    aria-pressed={enabled()}
                    aria-label={`${charset.label} characters`}
                    disabled={locked()}
                    onClick={() => toggleCharset(charset.key)}
                  >
                    {charset.label}
                  </button>
                );
              }}
            </For>

            <button
              type="button"
              class="ml-auto rounded-lg border px-3 py-1.5 text-[11px] transition"
              classList={{
                "border-forge-mint/40 bg-forge-mint/10 text-forge-mint":
                  options.avoidAmbiguous,
                "border-white/8 text-mist-500 hover:border-white/15 hover:text-mist-300":
                  !options.avoidAmbiguous,
              }}
              aria-pressed={options.avoidAmbiguous}
              onClick={() => setOptions("avoidAmbiguous", (value) => !value)}
            >
              No look-alikes
            </button>
          </div>
        </section>

        <p class="text-center text-[11px] text-mist-500">
          Generated locally with Web Crypto. Nothing is sent anywhere.
        </p>
      </main>
    </div>
  );
};

export default App;
