import { createSignal, onCleanup, onMount, Show, type Component } from "solid-js";
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
  const [copyNonce, setCopyNonce] = createSignal(0);
  const [notice, setNotice] = createSignal<string | null>(null);

  let noticeTimer: ReturnType<typeof setTimeout> | undefined;

  const flash = (message: string, ms = 1600) => {
    setNotice(message);
    clearTimeout(noticeTimer);
    noticeTimer = setTimeout(() => setNotice(null), ms);
  };

  const regenerateAndCopy = async () => {
    const next = generatePassword(OPTIONS);
    setPassword(next);
    const ok = await copyText(next);
    setCopyNonce((nonce) => nonce + 1);
    navigator.vibrate?.(15);
    flash(ok ? "Copied to clipboard" : "Couldn't copy — press Ctrl+C");
  };

  onMount(() => {
    void regenerateAndCopy();
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
        event.preventDefault();
        void regenerateAndCopy();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    onCleanup(() => document.removeEventListener("keydown", onKeyDown));
  });

  onCleanup(() => clearTimeout(noticeTimer));

  return (
    <div class="flex min-h-dvh flex-col bg-[var(--color-bg)] text-[var(--color-ink)]">
      <main class="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p class="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-[var(--color-muted)]">
          gen-password
        </p>

        <PasswordDisplay
          value={password()}
          copyNonce={copyNonce()}
          onCopy={() => void regenerateAndCopy()}
        />

        <p class="mt-4 h-5 text-sm text-[var(--color-faint)]" aria-live="polite">
          <Show when={notice()} fallback="Click to generate & copy">
            {notice()}
          </Show>
        </p>

        <footer class="mt-16 text-xs text-[var(--color-faint)]">
          Cryptographically random · generated locally · Ctrl+Enter to regenerate
        </footer>
      </main>
    </div>
  );
};

export default App;
