// Página inicial: cabeçalho, menu, fotos do topo, coleção de apartamentos e vídeo.
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Cabeçalho fica sólido depois do topo
  const header = document.querySelector('[data-lx-header]');
  const syncHeader = () => header?.classList.toggle('is-solid', window.scrollY > 40);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  // Menu do celular e do tablet
  const menuButton = document.querySelector('[data-lx-menu]');
  const nav = document.querySelector('[data-lx-nav]');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('lx-menu-open', open);
    header.classList.toggle('is-solid', open || window.scrollY > 40);
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  menuButton?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav?.classList.contains('is-open')) { setMenu(false); menuButton.focus(); }
  });

  const loadImage = img => {
    if (img?.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src;
  };

  // Fotos do topo: trocam a cada 6 s, com setas e botão de pausa
  const hero = document.querySelector('[data-lx-hero]');
  if (hero) {
    const slides = [...hero.querySelectorAll('.lx-hero-slides img')];
    const pause = hero.querySelector('[data-lx-pause]');
    let index = 0;
    let timer;
    let paused = false;
    const show = next => {
      index = (next + slides.length) % slides.length;
      loadImage(slides[index]);
      loadImage(slides[(index + 1) % slides.length]);
      slides.forEach((img, i) => img.classList.toggle('is-active', i === index));
    };
    const schedule = () => {
      clearTimeout(timer);
      if (paused || reduced.matches || document.hidden) return;
      timer = setTimeout(() => { show(index + 1); schedule(); }, 6000);
    };
    hero.querySelector('[data-lx-prev]')?.addEventListener('click', () => { show(index - 1); schedule(); });
    hero.querySelector('[data-lx-next]')?.addEventListener('click', () => { show(index + 1); schedule(); });
    if (reduced.matches) pause.hidden = true;
    pause?.addEventListener('click', () => {
      paused = !paused;
      pause.setAttribute('aria-pressed', String(paused));
      pause.setAttribute('aria-label', paused ? 'Retomar a troca de fotos' : 'Pausar a troca de fotos');
      schedule();
    });
    document.addEventListener('visibilitychange', schedule);
    window.addEventListener('load', () => loadImage(slides[1]));
    schedule();
  }

  // Coleção de apartamentos: setas, teclado e deslizar no celular
  const slider = document.querySelector('[data-lx-slider]');
  if (slider) {
    const rooms = [...slider.querySelectorAll('.lx-room')];
    const count = slider.querySelector('[data-lx-count]');
    let current = 0;
    const go = next => {
      current = (next + rooms.length) % rooms.length;
      rooms.forEach((room, i) => {
        const active = i === current;
        room.hidden = !active;
        room.classList.toggle('is-active', active);
        if (active) loadImage(room.querySelector('img'));
      });
      loadImage(rooms[(current + 1) % rooms.length].querySelector('img'));
      count.textContent = String(current + 1);
    };
    slider.querySelector('[data-lx-slide-prev]').addEventListener('click', () => go(current - 1));
    slider.querySelector('[data-lx-slide-next]').addEventListener('click', () => go(current + 1));
    slider.addEventListener('keydown', event => {
      if (event.target.closest('input, textarea')) return;
      if (event.key === 'ArrowLeft') go(current - 1);
      if (event.key === 'ArrowRight') go(current + 1);
    });
    let startX = null;
    slider.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', event => {
      if (startX === null) return;
      const dx = event.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1));
      startX = null;
    });
  }

  // Vídeo do hotel em janela
  const dialog = document.querySelector('[data-lx-dialog]');
  const video = dialog?.querySelector('video');
  document.querySelector('[data-lx-play]')?.addEventListener('click', () => {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    video.play().catch(() => {});
  });
  const closeDialog = () => { video?.pause(); dialog?.close?.(); };
  dialog?.querySelector('[data-lx-close]')?.addEventListener('click', closeDialog);
  dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
  dialog?.addEventListener('close', () => video?.pause());
})();
