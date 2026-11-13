// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { PasswordDisplay } from "../src/components/PasswordDisplay";

describe("PasswordDisplay", () => {
  it("shows text after value changes", async () => {
    const [value, setValue] = createSignal("");
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(() => (
      <PasswordDisplay value={value()} onCopy={() => {}} />
    ), host);
    await Promise.resolve();
    console.log("after mount:", JSON.stringify(host.querySelector(".pw-row")?.innerHTML));
    setValue("abc123");
    await new Promise((r) => setTimeout(r, 100));
    console.log("after set:", JSON.stringify(host.querySelector(".pw-row")?.innerHTML));
    await new Promise((r) => setTimeout(r, 1200));
    console.log("after settle:", JSON.stringify(host.querySelector(".pw-row")?.textContent));
    expect(host.querySelector(".pw-row")?.textContent?.length).toBeGreaterThan(0);
  });
});
