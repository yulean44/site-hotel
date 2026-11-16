import { trapFocus, setBackgroundInert } from './focus.js';

const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

if (header && toggle && nav) {
  const setOpen = open => {
    nav.classList.toggle('open', open);
    header.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    setBackgroundInert(header, open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (!header.classList.contains('open')) return;
    trapFocus(event, header);
    if (event.key === 'Escape') {
      setOpen(false);
      toggle.focus();
    }
  });
  const syncHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', syncHeader, { passive: true });
  syncHeader();
}
