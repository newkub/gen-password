// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { render } from "solid-js/web";
import App from "../src/App";

describe("App", () => {
  it("renders a generated password", async () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    render(() => <App />, host);
    await new Promise((r) => setTimeout(r, 1200));
    const row = host.querySelector(".pw-row");
    expect(row).not.toBeNull();
    expect((row?.textContent ?? "").length).toBeGreaterThan(10);
  });
});
