/**
 * Smoothly scrolls to the `#hash` section referenced by an anchor's `href`.
 *
 * When the target element exists in the DOM, this function:
 * 1. Prevents the browser's default navigation (avoiding a full-page reload or
 *    React Router re-navigation that would reset scroll position).
 * 2. Scrolls the target element into view using the CSS `scroll-behavior` value.
 * 3. Updates the URL bar via `history.pushState` so the back button and
 *    bookmarks work correctly without triggering React Router's router cycle.
 *
 * If the target element is NOT in the DOM (e.g., the user is on a sub-route
 * like `/admin`), the default browser navigation is preserved so React Router
 * can navigate to the correct page first.
 */
export function handleSmoothScroll(
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string
): void {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return;

  const id = href.slice(hashIndex + 1);
  const target = document.getElementById(id);

  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.pushState(null, "", href);
  }
  // If target not found, fall through to default navigation
}
