const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export const trapFocus = (event, container) => {
  if (event.key !== 'Tab') return;
  const focusableElements = [...container.querySelectorAll(focusableSelector)].filter(element =>
    !element.hidden && element.offsetParent !== null
  );
  if (!focusableElements.length) return;

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  const focusIsOutside = !container.contains(document.activeElement);

  if (event.shiftKey && (document.activeElement === first || focusIsOutside)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
};


// Restore the prior inert state instead of assuming all siblings were interactive.
const backgrounds = new WeakMap();
export function setBackgroundInert(surface, locked) {
  if (!locked) {
    for (const [element, inert] of backgrounds.get(surface) || []) element.inert = inert;
    backgrounds.delete(surface);
    return;
  }
  if (backgrounds.has(surface)) return;
  const previous = [];
  for (let node = surface; node.parentElement; node = node.parentElement) {
    for (const sibling of node.parentElement.children) {
      if (sibling !== node && !sibling.matches('script, style, link')) {
        previous.push([sibling, sibling.inert]);
        sibling.inert = true;
      }
    }
    if (node.parentElement === document.body) break;
  }
  backgrounds.set(surface, previous);
}
