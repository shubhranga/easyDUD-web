/**
 * Smoothly scroll to a section by its `id` and update the URL hash
 * via `replaceState` (never `pushState`) so browser history stays clean.
 *
 * Intentionally does **not** move keyboard focus to avoid hijacking the
 * keyboard focus ring and breaking sequential Tab navigation.
 */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", "#" + id);
  }
}

/**
 * Scroll back to the top of the page and strip the hash from the URL.
 */
export function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", window.location.pathname);
}
