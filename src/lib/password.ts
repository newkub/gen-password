export const CHARSETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/~|",
} as const;

export type CharsetKey = keyof typeof CHARSETS;

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 64;

const AMBIGUOUS = new Set("Il1O0o");

export interface PasswordOptions {
  length: number;
  lower: boolean;
  upper: boolean;
  digits: boolean;
  symbols: boolean;
  avoidAmbiguous: boolean;
}

export interface CharsetPool {
  key: CharsetKey;
  pool: string;
}

export interface Strength {
  score: 1 | 2 | 3 | 4;
  label: "Weak" | "Fair" | "Strong" | "Excellent";
  bits: number;
}

const randomBuffer = new Uint32Array(1);

function randomInt(maxExclusive: number): number {
  const limit = Math.floor(0x1_0000_0000 / maxExclusive) * maxExclusive;
  let value: number;
  do {
    crypto.getRandomValues(randomBuffer);
    value = randomBuffer[0]!;
  } while (value >= limit);
  return value % maxExclusive;
}

export function clampLength(length: number): number {
  if (!Number.isFinite(length)) return MIN_LENGTH;
  return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, Math.round(length)));
}

export function countActiveCharsets(options: PasswordOptions): number {
  return (
    Number(options.lower) +
    Number(options.upper) +
    Number(options.digits) +
    Number(options.symbols)
  );
}

export function buildPools(options: PasswordOptions): CharsetPool[] {
  const pools: CharsetPool[] = [];
  for (const key of Object.keys(CHARSETS) as CharsetKey[]) {
    if (!options[key]) continue;
    const source = CHARSETS[key];
    const pool = options.avoidAmbiguous
      ? Array.from(source)
          .filter((char) => !AMBIGUOUS.has(char))
          .join("")
      : source;
    if (pool.length > 0) pools.push({ key, pool });
  }
  return pools;
}

export function poolSize(options: PasswordOptions): number {
  return buildPools(options).reduce((total, entry) => total + entry.pool.length, 0);
}

export function generatePassword(options: PasswordOptions): string {
  const pools = buildPools(options);
  if (pools.length === 0) {
    throw new Error("Select at least one character type");
  }

  const length = clampLength(options.length);
  if (length < pools.length) {
    throw new Error("Password is shorter than the selected character types");
  }

  const all = pools.map((entry) => entry.pool).join("");
  const chars: string[] = pools.map((entry) => entry.pool[randomInt(entry.pool.length)]!);

  while (chars.length < length) {
    chars.push(all[randomInt(all.length)]!);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j]!, chars[i]!];
  }

  return chars.join("");
}

export function entropyBits(options: PasswordOptions): number {
  const size = poolSize(options);
  if (size <= 1) return 0;
  return clampLength(options.length) * Math.log2(size);
}

export function strengthOf(options: PasswordOptions): Strength {
  const bits = entropyBits(options);
  const score: Strength["score"] = bits >= 90 ? 4 : bits >= 70 ? 3 : bits >= 50 ? 2 : 1;
  const label: Strength["label"] =
    score === 4 ? "Excellent" : score === 3 ? "Strong" : score === 2 ? "Fair" : "Weak";
  return { score, label, bits };
}
