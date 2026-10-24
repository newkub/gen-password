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
  ShieldIcon,
} from "./components/Icons";
import { PasswordDisplay } from "./components/PasswordDisplay";
import { StrengthMeter } from "./components/StrengthMeter";
import { copyText } from "./lib/clipboard";
import { prefersReducedMotion } from "./lib/motion";
import {
  countActiveCharsets,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  poolSize,
  strengthOf,
  type CharsetKey,
  type PasswordOptions,
} from "./lib/password";

const CHARSET_FIELDS = [
  { key: "upper", label: "Uppercase", sample: "A–Z" },
  { key: "lower", label: "Lowercase", sample: "a–z" },
  { key: "digits", label: "Numbers", sample: "0–9" },
  { key: "symbols", label: "Symbols", sample: "!@#$" },
] as const satisfies ReadonlyArray<{ key: CharsetKey; label: string; sample: string }>;

const DEFAULT_OPTIONS: PasswordOptions = {
  length: 20,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
};

type Status = { text: string; tone: "ok" | "error" };

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
  const possibleChars = () => poolSize(options);
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
    const next = snapshot();
    try {
      setPassword(generatePassword(next));
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
    setStatus({ text: "Password copied", tone: "ok" });
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
    <div class="relative min-h-dvh overflow-hidden bg-ink-950 text-mist-100">
      <div class="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute left-1/2 top-[-24rem] h-[46rem] w-[46rem] -translate-x-1/2 rounded-full bg-forge-violet opacity-[0.14] blur-[150px]" />
        <div class="absolute bottom-[-20rem] right-[-10rem] h-[34rem] w-[34rem] rounded-full bg-forge-mint opacity-[0.09] blur-[140px]" />
        <div class="bg-grid absolute inset-0" />
      </div>

      <main class="relative mx-auto flex min-h-dvh w-full max-w-[46rem] flex-col justify-center gap-7 px-5 py-10 sm:gap-8 sm:px-8 sm:py-14">
        <header class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="grid h-10 w-10 place-items-center rounded-xl bg-linear-to-br from-forge-violet to-forge-mint shadow-[0_0_30px_-6px_rgba(167,139,250,.9)]">
              <KeyIcon class="h-5 w-5 text-ink-950" />
            </div>
            <div>
              <p class="text-[15px] font-semibold tracking-tight text-mist-100">Passforge</p>
              <p class="text-[11px] text-mist-400">Strong passwords, forged locally</p>
            </div>
          </div>
          <div class="flex items-center gap-2 rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 text-[11px] text-mist-400">
            <span class="h-1.5 w-1.5 rounded-full bg-forge-mint shadow-[0_0_8px_rgba(94,234,212,.9)]" />
            <span class="hidden sm:inline">Runs offline</span>
            <span class="sm:hidden">Local</span>
          </div>
        </header>

        <section class="vault">
          <div class="p-5 sm:p-8">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-400">
                  Generated password
                </p>
                <p class="mt-1 text-[11px] text-mist-400">Click the password to copy it</p>
              </div>
              <button
                type="button"
                class="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-mist-300 transition hover:border-white/15 hover:bg-white/[0.06] hover:text-mist-100"
                aria-pressed={hidden()}
                title={hidden() ? "Show password" : "Hide password"}
                onClick={() => setHidden((value) => !value)}
              >
                <Show when={hidden()} fallback={<EyeIcon class="h-3.5 w-3.5" />}>
                  <EyeOffIcon class="h-3.5 w-3.5" />
                </Show>
                {hidden() ? "Show" : "Hide"}
              </button>
            </div>

            <div class="mt-5 rounded-2xl border border-white/8 bg-ink-950/60 px-4 py-5 sm:px-5">
              <div class="flex min-h-14 items-center">
                <PasswordDisplay
                  value={password()}
                  hidden={hidden()}
                  copied={copied()}
                  copyNonce={copyNonce()}
                  onCopy={copy}
                />
              </div>

              <div class="mt-5 border-t border-white/6 pt-4">
                <StrengthMeter strength={strength()} />
              </div>

              <div class="mt-3 flex items-center justify-between gap-3 text-[10px] text-mist-400">
                <span>{options.length} characters</span>
                <span class="font-mono">{possibleChars()} possible chars</span>
              </div>
            </div>

            <div class="mt-4 grid gap-2.5 sm:grid-cols-[1.6fr_1fr]">
              <button type="button" class="copy-button" onClick={copy}>
                <Show when={copied()} fallback={<CopyIcon class="h-4 w-4" />}>
                  <CheckIcon class="h-4 w-4" />
                </Show>
                {copied() ? "Copied ✓" : "Copy password"}
              </button>
              <button type="button" class="gen-button" onClick={() => regenerate(true)}>
                <span ref={(element) => (genIcon = element)} class="inline-flex">
                  <RefreshIcon class="h-4 w-4" />
                </span>
                Generate
              </button>
            </div>

            <div class="mt-2 flex min-h-5 items-center justify-center text-[11px]" aria-live="polite">
              <Show when={status()}>
                {(current) => (
                  <span
                    class="inline-flex items-center gap-1.5"
                    classList={{
                      "text-forge-mint": current().tone === "ok",
                      "text-forge-coral": current().tone === "error",
                    }}
                  >
                    <span
                      class="h-1.5 w-1.5 rounded-full"
                      classList={{
                        "bg-forge-mint": current().tone === "ok",
                        "bg-forge-coral": current().tone === "error",
                      }}
                    />
                    {current().text}
                  </span>
                )}
              </Show>
            </div>

            <div class="mt-6 border-t border-white/8 pt-6">
              <div class="flex items-end justify-between gap-4">
                <div>
                  <label
                    for="length"
                    class="text-[11px] font-semibold uppercase tracking-[0.2em] text-mist-400"
                  >
                    Length
                  </label>
                  <p class="mt-1 text-[11px] text-mist-400">Longer is stronger.</p>
                </div>
                <div class="flex items-baseline gap-1.5">
                  <span class="font-mono text-2xl font-semibold tabular-nums text-mist-100">
                    {options.length}
                  </span>
                  <span class="text-[10px] text-mist-400">chars</span>
                </div>
              </div>

              <input
                id="length"
                class="range mt-3"
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
              <div class="mt-1 flex justify-between font-mono text-[10px] text-mist-400">
                <span>{MIN_LENGTH}</span>
                <span>{MAX_LENGTH}</span>
              </div>

              <div class="mt-5 grid grid-cols-2 gap-2.5">
                <For each={CHARSET_FIELDS}>
                  {(charset) => {
                    const enabled = () => options[charset.key];
                    const locked = () => enabled() && activeCount() === 1;
                    return (
                      <button
                        type="button"
                        class="flex items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60"
                        classList={{
                          "border-forge-violet/45 bg-forge-violet/10 hover:border-forge-violet/65":
                            enabled(),
                          "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04]":
                            !enabled(),
                        }}
                        aria-pressed={enabled()}
                        aria-label={`${charset.label} characters`}
                        disabled={locked()}
                        onClick={() => toggleCharset(charset.key)}
                      >
                        <span class="flex min-w-0 items-center gap-2.5">
                          <span
                            class="grid h-6 w-6 shrink-0 place-items-center rounded-md border"
                            classList={{
                              "border-forge-violet/40 bg-forge-violet/15 text-forge-mint":
                                enabled(),
                              "border-white/10 text-mist-400": !enabled(),
                            }}
                          >
                            <Show
                              when={enabled()}
                              fallback={<span class="h-1.5 w-1.5 rounded-full bg-mist-400" />}
                            >
                              <CheckIcon class="h-3.5 w-3.5" />
                            </Show>
                          </span>
                          <span class="min-w-0">
                            <span class="block truncate text-[13px] font-medium text-mist-200">
                              {charset.label}
                            </span>
                            <span class="block font-mono text-[10px] text-mist-400">
                              {charset.sample}
                            </span>
                          </span>
                        </span>
                        <span
                          class="font-mono text-[9px] uppercase tracking-[0.14em]"
                          classList={{
                            "text-forge-mint": enabled(),
                            "text-mist-400": !enabled(),
                          }}
                        >
                          {enabled() ? "On" : "Off"}
                        </span>
                      </button>
                    );
                  }}
                </For>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={options.avoidAmbiguous}
                class="mt-2.5 flex w-full items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-3 text-left transition hover:border-white/15 hover:bg-white/[0.04]"
                onClick={() => setOptions("avoidAmbiguous", (value) => !value)}
              >
                <span>
                  <span class="block text-[13px] font-medium text-mist-200">
                    Exclude look-alikes
                  </span>
                  <span class="mt-0.5 block text-[11px] text-mist-400">
                    Drops I, l, 1, O, 0 and o
                  </span>
                </span>
                <span
                  class="relative h-6 w-11 shrink-0 rounded-full border transition-colors"
                  classList={{
                    "border-forge-mint/50 bg-forge-mint/25": options.avoidAmbiguous,
                    "border-white/10 bg-white/5": !options.avoidAmbiguous,
                  }}
                >
                  <span
                    class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-mist-100 shadow-[0_2px_6px_rgba(0,0,0,.6)] transition-transform"
                    classList={{ "translate-x-5": options.avoidAmbiguous }}
                  />
                </span>
              </button>
            </div>
          </div>
        </section>

        <footer class="flex flex-col items-center justify-between gap-3 text-[11px] text-mist-400 sm:flex-row">
          <p class="flex items-center gap-2 text-center sm:text-left">
            <ShieldIcon class="h-3.5 w-3.5 text-forge-mint" />
            Web Crypto API · nothing leaves your browser
          </p>
          <p class="hidden items-center gap-1.5 sm:flex">
            <kbd>Enter</kbd> copy
            <span class="text-white/20">·</span>
            <kbd>Ctrl</kbd>
            <kbd>↵</kbd> regenerate
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;
