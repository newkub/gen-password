/// <reference types="chrome" />

type PasswordSettings = {
	length: number;
	lowercase: boolean;
	uppercase: boolean;
	numbers: boolean;
	symbols: boolean;
};

const DEFAULT_SETTINGS: PasswordSettings = {
	length: 16,
	lowercase: true,
	uppercase: true,
	numbers: true,
	symbols: false,
};

const STORAGE_KEY = "genPassword.settings";

function isValidSettings(value: unknown): value is PasswordSettings {
	if (!value || typeof value !== "object") return false;
	const v = value as Record<string, unknown>;
	return (
		typeof v.length === "number"
		&& typeof v.lowercase === "boolean"
		&& typeof v.uppercase === "boolean"
		&& typeof v.numbers === "boolean"
		&& typeof v.symbols === "boolean"
	);
}

async function readSettings(): Promise<PasswordSettings> {
	const result = await new Promise<Record<string, unknown>>((resolve, reject) => {
		try {
			chrome.storage.local.get(STORAGE_KEY, (items: Record<string, unknown>) => {
				const err = chrome.runtime.lastError;
				if (err) reject(err);
				else resolve(items as Record<string, unknown>);
			});
		} catch (err) {
			reject(err);
		}
	});

	const raw = result[STORAGE_KEY] as unknown;
	return isValidSettings(raw) ? raw : DEFAULT_SETTINGS;
}

async function writeSettings(settings: PasswordSettings): Promise<void> {
	await new Promise<void>((resolve, reject) => {
		try {
			chrome.storage.local.set({ [STORAGE_KEY]: settings }, () => {
				const err = chrome.runtime.lastError;
				if (err) reject(err);
				else resolve();
			});
		} catch (err) {
			reject(err);
		}
	});
}

function clampNumber(value: number, min: number, max: number): number {
	return Math.min(max, Math.max(min, value));
}

function getAlphabet(settings: PasswordSettings): string {
	let alphabet = "";
	if (settings.lowercase) alphabet += "abcdefghijklmnopqrstuvwxyz";
	if (settings.uppercase) alphabet += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	if (settings.numbers) alphabet += "0123456789";
	if (settings.symbols) alphabet += "!@#$%^&*()-_=+[]{};:,.?";
	return alphabet;
}

function randomInt(maxExclusive: number): number {
	const buf = new Uint32Array(1);
	crypto.getRandomValues(buf);
	return buf[0] % maxExclusive;
}

function generatePassword(settings: PasswordSettings): string {
	const length = clampNumber(Math.floor(settings.length), 6, 128);
	const alphabet = getAlphabet(settings);
	if (alphabet.length === 0) throw new Error("Select at least one character set");

	let out = "";
	for (let i = 0; i < length; i++) {
		out += alphabet[randomInt(alphabet.length)];
	}
	return out;
}

function setStatus(el: HTMLElement, message: string): void {
	el.textContent = message;
	if (message) {
		window.setTimeout(() => {
			if (el.textContent === message) el.textContent = "";
		}, 1600);
	}
}

function getEl<T extends HTMLElement>(id: string): T {
	const el = document.getElementById(id);
	if (!el) throw new Error(`Missing element: #${id}`);
	return el as T;
}

function readForm(): PasswordSettings {
	const lengthValue = Number(getEl<HTMLInputElement>("length").value);
	return {
		length: clampNumber(Number.isFinite(lengthValue) ? lengthValue : DEFAULT_SETTINGS.length, 6, 128),
		lowercase: getEl<HTMLInputElement>("lowercase").checked,
		uppercase: getEl<HTMLInputElement>("uppercase").checked,
		numbers: getEl<HTMLInputElement>("numbers").checked,
		symbols: getEl<HTMLInputElement>("symbols").checked,
	};
}

function writeForm(settings: PasswordSettings): void {
	getEl<HTMLInputElement>("length").value = String(settings.length);
	getEl<HTMLInputElement>("lowercase").checked = settings.lowercase;
	getEl<HTMLInputElement>("uppercase").checked = settings.uppercase;
	getEl<HTMLInputElement>("numbers").checked = settings.numbers;
	getEl<HTMLInputElement>("symbols").checked = settings.symbols;
}

async function main(): Promise<void> {
	const passwordEl = getEl<HTMLInputElement>("password");
	const statusEl = getEl<HTMLElement>("status");

	const settings = await readSettings();
	writeForm(settings);

	try {
		passwordEl.value = generatePassword(settings);
	} catch (err) {
		passwordEl.value = "";
		setStatus(statusEl, err instanceof Error ? err.message : "Failed to generate");
	}

	getEl<HTMLButtonElement>("generate").addEventListener("click", () => {
		try {
			const next = readForm();
			passwordEl.value = generatePassword(next);
			setStatus(statusEl, "Generated");
		} catch (err) {
			setStatus(statusEl, err instanceof Error ? err.message : "Failed to generate");
		}
	});

	getEl<HTMLButtonElement>("copy").addEventListener("click", async () => {
		const value = passwordEl.value;
		if (!value) {
			setStatus(statusEl, "Nothing to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(value);
			setStatus(statusEl, "Copied");
		} catch {
			try {
				passwordEl.select();
				document.execCommand("copy");
				setStatus(statusEl, "Copied");
			} catch {
				setStatus(statusEl, "Copy failed");
			}
		}
	});

	getEl<HTMLButtonElement>("save").addEventListener("click", async () => {
		try {
			const next = readForm();
			await writeSettings(next);
			setStatus(statusEl, "Saved");
		} catch {
			setStatus(statusEl, "Save failed");
		}
	});

	getEl<HTMLButtonElement>("reset").addEventListener("click", async () => {
		writeForm(DEFAULT_SETTINGS);
		await writeSettings(DEFAULT_SETTINGS);
		try {
			passwordEl.value = generatePassword(DEFAULT_SETTINGS);
		} catch {
			passwordEl.value = "";
		}
		setStatus(statusEl, "Reset");
	});
}

void main();
