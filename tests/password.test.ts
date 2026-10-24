import { describe, expect, it } from "vitest";
import {
  CHARSETS,
  entropyBits,
  generatePassword,
  MAX_LENGTH,
  MIN_LENGTH,
  strengthOf,
  type PasswordOptions,
} from "../src/lib/password";

const BASE: PasswordOptions = {
  length: 20,
  lower: true,
  upper: true,
  digits: true,
  symbols: true,
  avoidAmbiguous: false,
};

const hasAny = (value: string, pool: string) => [...value].some((char) => pool.includes(char));

describe("generatePassword", () => {
  it("generates the requested number of characters", () => {
    for (const length of [8, 16, 20, 32, 64]) {
      expect(generatePassword({ ...BASE, length })).toHaveLength(length);
    }
  });

  it("only uses characters from the enabled sets", () => {
    const password = generatePassword({ ...BASE, lower: false, upper: false, symbols: false });
    expect(password).toMatch(/^\d+$/);
  });

  it("includes at least one character from every enabled set", () => {
    for (let run = 0; run < 100; run++) {
      const password = generatePassword(BASE);
      expect(hasAny(password, CHARSETS.lower)).toBe(true);
      expect(hasAny(password, CHARSETS.upper)).toBe(true);
      expect(hasAny(password, CHARSETS.digits)).toBe(true);
      expect(hasAny(password, CHARSETS.symbols)).toBe(true);
    }
  });

  it("removes ambiguous characters when requested", () => {
    for (let run = 0; run < 100; run++) {
      const password = generatePassword({ ...BASE, avoidAmbiguous: true });
      expect(password).not.toMatch(/[Il1O0o]/);
    }
  });

  it("clamps out-of-range lengths", () => {
    expect(generatePassword({ ...BASE, length: 2 })).toHaveLength(MIN_LENGTH);
    expect(generatePassword({ ...BASE, length: 500 })).toHaveLength(MAX_LENGTH);
  });

  it("rejects an empty character selection", () => {
    expect(() =>
      generatePassword({ ...BASE, lower: false, upper: false, digits: false, symbols: false }),
    ).toThrow(/at least one/);
  });

  it("produces a different password each time", () => {
    const samples = new Set(Array.from({ length: 25 }, () => generatePassword(BASE)));
    expect(samples.size).toBe(25);
  });
});

describe("entropy and strength", () => {
  it("increases entropy with length", () => {
    expect(entropyBits({ ...BASE, length: 32 })).toBeGreaterThan(
      entropyBits({ ...BASE, length: 16 }),
    );
  });

  it("rates a short lowercase-only password as weak", () => {
    const strength = strengthOf({
      ...BASE,
      length: 8,
      upper: false,
      digits: false,
      symbols: false,
    });
    expect(strength.score).toBe(1);
    expect(strength.label).toBe("Weak");
  });

  it("rates a long mixed password as excellent", () => {
    const strength = strengthOf({ ...BASE, length: 32 });
    expect(strength.score).toBe(4);
    expect(strength.label).toBe("Excellent");
  });
});
