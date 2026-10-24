export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function replayAnimation(
  elements: ArrayLike<HTMLElement | undefined>,
  className: string,
  staggerMs: number,
  maxDelayMs = 400,
): void {
  Array.from(elements).forEach((element, index) => {
    if (!element?.isConnected) return;
    element.classList.remove("pop", "wave");
    void element.offsetWidth;
    element.style.animationDelay = `${Math.min(index * staggerMs, maxDelayMs)}ms`;
    element.classList.add(className);
    element.addEventListener("animationend", () => element.classList.remove(className), {
      once: true,
    });
  });
}

export function clearAnimations(elements: ArrayLike<HTMLElement | undefined>): void {
  Array.from(elements).forEach((element) => {
    if (!element) return;
    element.classList.remove("pop", "wave");
    element.style.animationDelay = "";
  });
}
