const botanicalSelectors = [
  'main > .intro-panel',
  'main > .content-two-col',
  'main > .then-now',
  'main > .gallery-index'
];
const botanicalSections = document.querySelectorAll(botanicalSelectors.join(','));

botanicalSections.forEach((section) => {
  const accent = document.createElement('span');
  const side = section.matches('.content-two-col') ? 'left' : 'right';
  accent.className = `site-botanical-accent botanical-side-${side}`;
  accent.setAttribute('aria-hidden', 'true');
  section.classList.add('site-botanical-section');
  if (section.matches('.feature-band.reverse, .dark-section, .restaurant-menu')) {
    section.classList.add('site-botanical-dark');
  }
  section.append(accent);
});
