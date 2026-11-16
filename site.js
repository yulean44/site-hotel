// Site do Hotel Vila Nova do Príncipe: cabeçalho, menu, fotos do topo, apartamentos, reserva, galeria ampliada.
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

  // Carrega uma foto adiada, inclusive as versões de celular e computador dentro de <picture>
  const loadImage = img => {
    if (!img) return;
    img.parentElement?.querySelectorAll('source[data-srcset]').forEach(source => {
      source.srcset = source.dataset.srcset;
      source.removeAttribute('data-srcset');
    });
    if (img.dataset.srcset) { img.srcset = img.dataset.srcset; img.removeAttribute('data-srcset'); }
    if (img.dataset.src && !img.getAttribute('src')) img.src = img.dataset.src;
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

})();

// Reserva pelo WhatsApp (página inicial): datas, hóspedes e pets
(() => {
  const form = document.querySelector('[data-home-booking]');
  if (!form) return;
  const { checkin, checkout, adults, children, pets } = form.elements;
  const iso = date => new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const br = value => value.split('-').reverse().join('/');
  const today = new Date();
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);
  checkin.min = checkin.value = iso(today);
  checkout.min = checkout.value = iso(tomorrow);
  checkin.addEventListener('change', () => {
    if (!checkin.value) return;
    const next = new Date(`${checkin.value}T12:00:00`); next.setDate(next.getDate() + 1);
    checkout.min = iso(next);
    if (!checkout.value || checkout.value <= checkin.value) checkout.value = iso(next);
  });
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  form.addEventListener('submit', event => {
    event.preventDefault();
    const a = Number(adults.value), c = Number(children.value), p = Number(pets.value);
    const message = `Olá, Hotel Vila Nova do Príncipe! Gostaria de saber se há disponibilidade para uma reserva com entrada em ${br(checkin.value)} e saída em ${br(checkout.value)}, para ${plural(a, 'adulto', 'adultos')}, ${c ? plural(c, 'criança', 'crianças') : 'sem crianças'} e ${p ? plural(p, 'pet', 'pets') : 'sem pets'}. Poderia me informar os valores e as opções?`;
    window.open(`https://wa.me/5577981021991?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });

  const picker = form.querySelector('[data-guest-picker]');
  const toggle = picker.querySelector('[data-guest-toggle]');
  const panel = picker.querySelector('[data-guest-panel]');
  const summary = picker.querySelector('[data-guest-summary]');
  const steppers = [...picker.querySelectorAll('[data-guest-stepper]')];
  const update = () => {
    const [a, c, p] = steppers.map(s => Number(s.querySelector('input').value));
    summary.textContent = [plural(a, 'adulto', 'adultos'), c && plural(c, 'criança', 'crianças'), p && plural(p, 'pet', 'pets')].filter(Boolean).join(', ');
  };
  const close = () => { panel.hidden = true; toggle.setAttribute('aria-expanded', 'false'); };
  toggle.addEventListener('click', () => {
    const open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  });
  steppers.forEach(stepper => {
    const input = stepper.querySelector('input');
    const output = stepper.querySelector('[data-guest-count]');
    const min = Number(stepper.dataset.min), max = Number(stepper.dataset.max);
    const set = value => { input.value = String(Math.min(max, Math.max(min, value))); output.textContent = input.value; update(); };
    stepper.querySelector('[data-guest-minus]').addEventListener('click', () => set(Number(input.value) - 1));
    stepper.querySelector('[data-guest-plus]').addEventListener('click', () => set(Number(input.value) + 1));
  });
  document.addEventListener('click', event => { if (!picker.contains(event.target)) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) { close(); toggle.focus(); } });
  update();
})();

// Fotos ampliadas: abre a foto grande, com setas, teclado e deslizar
(() => {
  const box = document.querySelector('[data-lx-lightbox]');
  if (!box) return;
  const img = box.querySelector('img');
  const caption = box.querySelector('figcaption');
  const count = box.querySelector('.lx-lb-count');
  let items = [];
  let index = 0;
  const show = i => {
    index = (i + items.length) % items.length;
    const link = items[index];
    img.src = link.getAttribute('href');
    img.alt = link.dataset.caption || '';
    caption.textContent = link.dataset.caption || '';
    count.textContent = `${index + 1} de ${items.length}`;
    box.classList.toggle('is-single', items.length < 2);
    const next = items[(index + 1) % items.length];
    if (next) new Image().src = next.getAttribute('href');
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('[data-lightbox]');
    if (!link || event.metaKey || event.ctrlKey) return;
    event.preventDefault();
    items = [...document.querySelectorAll(`[data-lightbox="${link.dataset.lightbox}"]`)];
    show(items.indexOf(link));
    box.showModal();
  });
  box.querySelector('[data-lb-close]').addEventListener('click', () => box.close());
  box.querySelector('[data-lb-prev]').addEventListener('click', () => show(index - 1));
  box.querySelector('[data-lb-next]').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', event => { if (event.target === box) box.close(); });
  box.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') show(index - 1);
    if (event.key === 'ArrowRight') show(index + 1);
  });
  let startX = null;
  box.addEventListener('touchstart', event => { startX = event.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', event => {
    if (startX === null) return;
    const dx = event.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
  box.addEventListener('close', () => { img.removeAttribute('src'); });
})();
