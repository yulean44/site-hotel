const header = document.querySelector('[data-header]');
const toggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

const trapFocus = (event, container) => {
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

document.body.classList.add('fasano-shell');
document.body.classList.add('botanical-site');

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

if (toggle) {
  while (toggle.children.length < 3) toggle.append(document.createElement('span'));
}

const hero = document.querySelector('main > .fasano-home-hero, main > .page-hero');

if (hero && nav && !document.querySelector('.section-navigation')) {
  const sectionNavigation = document.createElement('nav');
  sectionNavigation.className = 'section-navigation';
  sectionNavigation.setAttribute('aria-label', 'Seções do hotel');

  nav.querySelectorAll('a').forEach(link => {
    const sectionLink = document.createElement('a');
    sectionLink.href = link.getAttribute('href');
    sectionLink.textContent = link.querySelector('span')?.textContent || link.textContent.trim();
    if (link.classList.contains('active')) sectionLink.classList.add('active');
    sectionNavigation.append(sectionLink);
  });

  hero.insertAdjacentElement('afterend', sectionNavigation);

  const activeSection = sectionNavigation.querySelector('.active');
  if (activeSection) {
    requestAnimationFrame(() => {
      activeSection.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
        inline: 'center'
      });
    });
  }
}

document.querySelectorAll('.site-footer').forEach(footer => {
  const whatsappLink = footer.querySelector('a[href*="wa.me"]');
  if (!whatsappLink || footer.querySelector('.footer-phone')) return;

  const contact = document.createElement('div');
  contact.className = 'footer-contact';
  whatsappLink.before(contact);
  contact.append(whatsappLink);

  const phone = document.createElement('a');
  phone.className = 'footer-phone';
  phone.href = 'tel:+5577981021991';
  phone.textContent = '(77) 98102-1991';
  phone.setAttribute('aria-label', 'Ligar para o Hotel Vila Nova do Príncipe');
  contact.append(phone);

  const instagram = document.createElement('a');
  instagram.className = 'footer-instagram';
  instagram.href = 'https://www.instagram.com/hotelvilanovadoprincipe';
  instagram.target = '_blank';
  instagram.rel = 'noopener';
  instagram.setAttribute('aria-label', 'Abrir Instagram do Hotel Vila Nova do Príncipe');
  instagram.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg><span>@hotelvilanovadoprincipe</span>';
  contact.append(instagram);
});

const homeBooking = document.querySelector('[data-home-booking]');
const homeHeroSlideshow = document.querySelector('[data-home-hero-slideshow]');

if (homeHeroSlideshow) {
  const layers = [...homeHeroSlideshow.querySelectorAll('[data-home-hero-layer]')];
  const slides = [
    { src: 'assets/images/hero-slides/piscina.webp', position: '58% center', mobilePosition: '54% center' },
    { src: 'assets/images/hero-slides/predio.webp', position: '50% 48%', mobilePosition: '50% 45%' },
    { src: 'assets/images/hero-slides/ambiente.webp', position: '50% 54%', mobilePosition: '50% 48%' },
    { src: 'assets/images/hero-slides/fachada.webp', position: '50% 50%', mobilePosition: '52% 50%' },
    { src: 'assets/images/hero-slides/restaurante.webp', position: '50% 52%', mobilePosition: '50% 50%' }
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const displayTime = 6200;
  let slideIndex = 0;
  let visibleLayer = 0;
  let slideTimer;

  const applySlide = (layer, slide) => {
    layer.src = slide.src;
    layer.style.setProperty('--hero-position', slide.position);
    layer.style.setProperty('--hero-position-mobile', slide.mobilePosition);
  };

  const preloadSlide = slide => new Promise(resolve => {
    const image = new Image();
    image.src = slide.src;
    image.onload = () => {
      const decoding = image.decode
        ? image.decode().catch(() => {})
        : Promise.resolve();
      decoding.finally(resolve);
    };
    image.onerror = resolve;
  });

  const scheduleNextSlide = () => {
    window.clearTimeout(slideTimer);
    if (reducedMotion.matches || document.hidden) return;

    slideTimer = window.setTimeout(async () => {
      const nextIndex = (slideIndex + 1) % slides.length;
      const nextLayerIndex = visibleLayer === 0 ? 1 : 0;
      const nextLayer = layers[nextLayerIndex];

      await preloadSlide(slides[nextIndex]);
      applySlide(nextLayer, slides[nextIndex]);
      nextLayer.classList.add('is-active');
      layers[visibleLayer].classList.remove('is-active');
      slideIndex = nextIndex;
      visibleLayer = nextLayerIndex;
      scheduleNextSlide();
    }, displayTime);
  };

  applySlide(layers[0], slides[0]);
  preloadSlide(slides[1]);
  scheduleNextSlide();

  document.addEventListener('visibilitychange', scheduleNextSlide);
  reducedMotion.addEventListener?.('change', scheduleNextSlide);
}

if (homeBooking) {
  const checkin = homeBooking.elements.checkin;
  const checkout = homeBooking.elements.checkout;
  const adults = homeBooking.elements.adults;
  const children = homeBooking.elements.children;
  const pets = homeBooking.elements.pets;
  const toISODate = date => {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 10);
  };
  const formatDate = value => value.split('-').reverse().join('/');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  checkin.min = toISODate(today);
  checkin.value = toISODate(today);
  checkout.min = toISODate(tomorrow);
  checkout.value = toISODate(tomorrow);

  checkin.addEventListener('change', () => {
    if (!checkin.value) return;
    const nextDay = new Date(`${checkin.value}T12:00:00`);
    nextDay.setDate(nextDay.getDate() + 1);
    checkout.min = toISODate(nextDay);
    if (!checkout.value || checkout.value <= checkin.value) checkout.value = toISODate(nextDay);
  });

  homeBooking.addEventListener('submit', event => {
    event.preventDefault();
    const adultCount = Number(adults.value);
    const childCount = Number(children.value);
    const petCount = Number(pets.value);
    const adultLabel = `${adultCount} ${adultCount === 1 ? 'adulto' : 'adultos'}`;
    const childLabel = childCount ? `${childCount} ${childCount === 1 ? 'crian\u00e7a' : 'crian\u00e7as'}` : 'sem crian\u00e7as';
    const petLabel = petCount ? `${petCount} ${petCount === 1 ? 'pet' : 'pets'}` : 'sem pets';
    const message = `Ol\u00e1, Hotel Vila Nova do Pr\u00edncipe! Gostaria de saber se h\u00e1 disponibilidade para uma reserva com entrada em ${formatDate(checkin.value)} e sa\u00edda em ${formatDate(checkout.value)}, para ${adultLabel}, ${childLabel} e ${petLabel}. Poderia me informar os valores e as op\u00e7\u00f5es?`;
    window.open(`https://wa.me/5577981021991?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}

const guestPicker = document.querySelector('[data-guest-picker]');

if (guestPicker) {
  const guestToggle = guestPicker.querySelector('[data-guest-toggle]');
  const guestPanel = guestPicker.querySelector('[data-guest-panel]');
  const guestSummary = guestPicker.querySelector('[data-guest-summary]');
  const steppers = [...guestPicker.querySelectorAll('[data-guest-stepper]')];

  const updateGuestSummary = () => {
    const [adultCount, childCount, petCount] = steppers.map(stepper => Number(stepper.querySelector('input').value));
    const parts = [`${adultCount} ${adultCount === 1 ? 'adulto' : 'adultos'}`];
    if (childCount) parts.push(`${childCount} ${childCount === 1 ? 'crian\u00e7a' : 'crian\u00e7as'}`);
    if (petCount) parts.push(`${petCount} ${petCount === 1 ? 'pet' : 'pets'}`);
    guestSummary.textContent = parts.join(', ');
  };

  const closeGuestPicker = () => {
    guestPanel.hidden = true;
    guestToggle.setAttribute('aria-expanded', 'false');
  };

  guestToggle.addEventListener('click', () => {
    const opening = guestPanel.hidden;
    guestPanel.hidden = !opening;
    guestToggle.setAttribute('aria-expanded', String(opening));
  });

  steppers.forEach(stepper => {
    const input = stepper.querySelector('input');
    const output = stepper.querySelector('[data-guest-count]');
    const minimum = Number(stepper.dataset.min);
    const maximum = Number(stepper.dataset.max);

    stepper.querySelector('[data-guest-minus]').addEventListener('click', () => {
      input.value = String(Math.max(minimum, Number(input.value) - 1));
      output.textContent = input.value;
      updateGuestSummary();
    });

    stepper.querySelector('[data-guest-plus]').addEventListener('click', () => {
      input.value = String(Math.min(maximum, Number(input.value) + 1));
      output.textContent = input.value;
      updateGuestSummary();
    });
  });

  document.addEventListener('click', event => {
    if (!guestPicker.contains(event.target)) closeGuestPicker();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !guestPanel.hidden) {
      closeGuestPicker();
      guestToggle.focus();
    }
  });

  updateGuestSummary();
}

const roomModal = document.querySelector('[data-room-modal]');

if (roomModal) {
  const roomCatalog = {
    standard: {
      title: 'Standard',
      description: 'Apartamentos aconchegantes, localizados em sua maioria na ala hist\u00f3rica. Duas unidades ficam no s\u00f3t\u00e3o, o que lhes confere um charme especial.',
      features: ['Ar-condicionado', 'TV', 'Frigobar', 'Cofre digital', 'Wi-Fi', 'Ala hist\u00f3rica', 'Duas unidades no s\u00f3t\u00e3o'],
      images: Array.from({ length: 5 }, (_, index) => `assets/images/acomodacoes/standard-${index + 1}.jpg`)
    },
    luxo: {
      title: 'Luxo',
      description: 'Onze apartamentos distribu\u00eddos entre a ala hist\u00f3rica e a parte contempor\u00e2nea. Possuem boa \u00e1rea interna e acomodam at\u00e9 tr\u00eas pessoas. Algumas unidades contam com varanda privativa ou vista da cidade; outras ficam pr\u00f3ximas \u00e0 piscina.',
      features: ['At\u00e9 3 h\u00f3spedes', 'Ar-condicionado', 'TV', 'Frigobar', 'Cofre digital', 'Wi-Fi', 'Varanda em algumas unidades', 'Vista da cidade em algumas unidades', 'Unidades pr\u00f3ximas \u00e0 piscina'],
      images: Array.from({ length: 6 }, (_, index) => `assets/images/acomodacoes/luxo-${index + 1}.jpg`)
    },
    'super-luxo': {
      title: 'Super Luxo',
      description: 'Uma acomoda\u00e7\u00e3o exclusiva na parte contempor\u00e2nea, com duas varandas privativas, closet e vista privilegiada da cidade e da Catedral de Caetit\u00e9.',
      features: ['Acomoda\u00e7\u00e3o exclusiva', '2 varandas privativas', 'Closet', 'Vista da Catedral', 'Vista da cidade', 'Ar-condicionado', 'TV', 'Frigobar', 'Cofre digital', 'Wi-Fi'],
      images: Array.from({ length: 6 }, (_, index) => `assets/images/acomodacoes/super-luxo-${index + 1}.jpg`)
    }
  };
  const title = roomModal.querySelector('[data-room-title]');
  const description = roomModal.querySelector('[data-room-description]');
  const features = roomModal.querySelector('[data-room-features]');
  const image = roomModal.querySelector('[data-room-image]');
  const counter = roomModal.querySelector('[data-room-counter]');
  const thumbnails = roomModal.querySelector('[data-room-thumbnails]');
  const reserve = roomModal.querySelector('[data-room-reserve]');
  const closeButton = roomModal.querySelector('.room-modal-close');
  let activeRoom = null;
  let activeIndex = 0;
  let lastTrigger = null;

  const renderRoomImage = () => {
    if (!activeRoom) return;
    image.src = activeRoom.images[activeIndex];
    image.alt = `${activeRoom.title} - foto ${activeIndex + 1}`;
    counter.textContent = `${activeIndex + 1} / ${activeRoom.images.length}`;
    thumbnails.querySelectorAll('button').forEach((button, index) => {
      button.classList.toggle('active', index === activeIndex);
      button.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  };

  const closeRoomModal = () => {
    roomModal.hidden = true;
    document.body.classList.remove('room-modal-open');
    if (lastTrigger) lastTrigger.focus();
  };

  const openRoomModal = (key, trigger) => {
    activeRoom = roomCatalog[key];
    if (!activeRoom) return;
    activeIndex = 0;
    lastTrigger = trigger;
    title.textContent = activeRoom.title;
    description.textContent = activeRoom.description;
    features.replaceChildren(...activeRoom.features.map(feature => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }));
    thumbnails.replaceChildren(...activeRoom.images.map((source, index) => {
      const button = document.createElement('button');
      const thumbnail = document.createElement('img');
      button.type = 'button';
      button.setAttribute('aria-label', `Ver foto ${index + 1} de ${activeRoom.title}`);
      thumbnail.src = source;
      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      button.append(thumbnail);
      button.addEventListener('click', () => {
        activeIndex = index;
        renderRoomImage();
      });
      return button;
    }));
    const message = `Ol\u00e1, Hotel Vila Nova do Pr\u00edncipe! Gostaria de consultar disponibilidade e valores para a categoria ${activeRoom.title}.`;
    reserve.href = `https://wa.me/5577981021991?text=${encodeURIComponent(message)}`;
    roomModal.hidden = false;
    document.body.classList.add('room-modal-open');
    renderRoomImage();
    closeButton.focus();
  };

  document.querySelectorAll('[data-room-open]').forEach(button => {
    button.addEventListener('click', () => openRoomModal(button.dataset.roomOpen, button));
  });
  roomModal.querySelectorAll('[data-room-close]').forEach(button => button.addEventListener('click', closeRoomModal));
  roomModal.querySelector('[data-room-previous]').addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + activeRoom.images.length) % activeRoom.images.length;
    renderRoomImage();
  });
  roomModal.querySelector('[data-room-next]').addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % activeRoom.images.length;
    renderRoomImage();
  });
  document.addEventListener('keydown', event => {
    if (roomModal.hidden) return;
    trapFocus(event, roomModal);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeRoomModal();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      roomModal.querySelector('[data-room-previous]').click();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      roomModal.querySelector('[data-room-next]').click();
    }
  });
  const requestedRoom = new URLSearchParams(window.location.search).get('quarto');
  const requestedTrigger = requestedRoom ? document.querySelector(`[data-room-open="${requestedRoom}"]`) : null;
  if (requestedTrigger) openRoomModal(requestedRoom, requestedTrigger);
}

const weddingModal = document.querySelector('[data-wedding-modal]');

if (weddingModal) {
  const weddingImages = Array.from({ length: 42 }, (_, index) =>
    `assets/images/noite-de-nupcias/noite-${String(index + 1).padStart(2, '0')}.jpg`
  );
  const sharedFeatures = [
    'Len\u00e7\u00f3is e almofadas bordados',
    'Rosas vermelhas, p\u00e9talas e velas',
    'Roup\u00f5es e itens de cuidado pessoal',
    'Espumante e ta\u00e7as decoradas',
    'Bombons, trufas, uvas, morangos e sequilhos',
    'Caf\u00e9 da manh\u00e3 servido no apartamento at\u00e9 as 10 h'
  ];
  const weddingCatalog = {
    'super-luxo': {
      title: 'Super Luxo',
      price: 'R$ 395,00 + a di\u00e1ria da acomoda\u00e7\u00e3o escolhida',
      description: 'Uma experi\u00eancia completa para celebrar a noite de n\u00fapcias, com o apartamento preparado em detalhes, sabores especiais e caf\u00e9 da manh\u00e3 servido com privacidade.'
    },
    luxo: {
      title: 'Luxo',
      price: 'R$ 345,00 + a di\u00e1ria da acomoda\u00e7\u00e3o escolhida',
      description: 'Uma composi\u00e7\u00e3o rom\u00e2ntica e acolhedora para o casal, reunindo decora\u00e7\u00e3o, delicadezas e caf\u00e9 da manh\u00e3 no apartamento.'
    },
    especial: {
      title: 'Especial',
      price: 'R$ 195,00 + a di\u00e1ria da acomoda\u00e7\u00e3o escolhida',
      description: 'Uma op\u00e7\u00e3o delicada para transformar a chegada ao hotel em um momento marcante, com prepara\u00e7\u00e3o rom\u00e2ntica e detalhes para o casal.'
    }
  };
  const title = weddingModal.querySelector('[data-wedding-title]');
  const price = weddingModal.querySelector('[data-wedding-price]');
  const description = weddingModal.querySelector('[data-wedding-description]');
  const features = weddingModal.querySelector('[data-wedding-features]');
  const image = weddingModal.querySelector('[data-wedding-image]');
  const counter = weddingModal.querySelector('[data-wedding-counter]');
  const thumbnails = weddingModal.querySelector('[data-wedding-thumbnails]');
  const reserve = weddingModal.querySelector('[data-wedding-reserve]');
  const closeButton = weddingModal.querySelector('.room-modal-close');
  let activePackage = null;
  let activeIndex = 0;
  let lastTrigger = null;

  const renderWeddingImage = () => {
    image.src = weddingImages[activeIndex];
    image.alt = `${activePackage.title} - registro ${activeIndex + 1}`;
    counter.textContent = `${activeIndex + 1} / ${weddingImages.length}`;
    thumbnails.querySelectorAll('button').forEach((button, index) => {
      button.classList.toggle('active', index === activeIndex);
      button.setAttribute('aria-current', index === activeIndex ? 'true' : 'false');
    });
  };

  const closeWeddingModal = () => {
    weddingModal.hidden = true;
    document.body.classList.remove('room-modal-open');
    if (lastTrigger) lastTrigger.focus();
  };

  const openWeddingModal = (key, trigger) => {
    activePackage = weddingCatalog[key];
    if (!activePackage) return;
    activeIndex = 0;
    lastTrigger = trigger;
    title.textContent = activePackage.title;
    price.textContent = activePackage.price;
    description.textContent = activePackage.description;
    features.replaceChildren(...sharedFeatures.map(feature => {
      const item = document.createElement('li');
      item.textContent = feature;
      return item;
    }));
    thumbnails.replaceChildren(...weddingImages.map((source, index) => {
      const button = document.createElement('button');
      const thumbnail = document.createElement('img');
      button.type = 'button';
      button.setAttribute('aria-label', `Ver registro ${index + 1}`);
      thumbnail.src = source;
      thumbnail.alt = '';
      thumbnail.loading = 'lazy';
      button.append(thumbnail);
      button.addEventListener('click', () => {
        activeIndex = index;
        renderWeddingImage();
      });
      return button;
    }));
    const message = `Ol\u00e1, Hotel Vila Nova do Pr\u00edncipe! Gostaria de consultar disponibilidade, composi\u00e7\u00e3o e valores para o pacote de Noite de N\u00fapcias ${activePackage.title}.`;
    reserve.href = `https://wa.me/5577981021991?text=${encodeURIComponent(message)}`;
    weddingModal.hidden = false;
    document.body.classList.add('room-modal-open');
    renderWeddingImage();
    closeButton.focus();
  };

  document.querySelectorAll('[data-wedding-open]').forEach(button => {
    button.addEventListener('click', () => openWeddingModal(button.dataset.weddingOpen, button));
  });
  weddingModal.querySelectorAll('[data-wedding-close]').forEach(button => button.addEventListener('click', closeWeddingModal));
  weddingModal.querySelector('[data-wedding-previous]').addEventListener('click', () => {
    activeIndex = (activeIndex - 1 + weddingImages.length) % weddingImages.length;
    renderWeddingImage();
  });
  weddingModal.querySelector('[data-wedding-next]').addEventListener('click', () => {
    activeIndex = (activeIndex + 1) % weddingImages.length;
    renderWeddingImage();
  });
  document.addEventListener('keydown', event => {
    if (weddingModal.hidden) return;
    trapFocus(event, weddingModal);
    if (event.key === 'Escape') {
      event.preventDefault();
      closeWeddingModal();
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      weddingModal.querySelector('[data-wedding-previous]').click();
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      weddingModal.querySelector('[data-wedding-next]').click();
    }
  });
  const requestedPackage = new URLSearchParams(window.location.search).get('pacote');
  const requestedTrigger = requestedPackage ? document.querySelector(`[data-wedding-open="${requestedPackage}"]`) : null;
  if (requestedTrigger) openWeddingModal(requestedPackage, requestedTrigger);
}

const syncHeader = () => {
  if (header) header.classList.toggle('scrolled', window.scrollY > 20);
};

const scrollActiveNav = () => {
  if (!nav || !window.matchMedia('(max-width: 760px)').matches) return;
  const active = nav.querySelector('a.active');
  if (!active) return;
  const left = active.offsetLeft - (nav.clientWidth - active.clientWidth) / 2;
  nav.scrollTo({ left: Math.max(0, left), behavior: 'auto' });
};

if (toggle && nav && header) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    header.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });

  nav.addEventListener('click', event => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      header.classList.remove('open');
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !nav.classList.contains('open')) return;
    nav.classList.remove('open');
    header.classList.remove('open');
    document.body.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.focus();
  });
}

document.querySelectorAll('main > section:not(.fasano-home-hero)').forEach(section => section.classList.add('reveal'));

const revealSections = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -5% 0px' });

  revealSections.forEach(section => observer.observe(section));
} else {
  revealSections.forEach(section => section.classList.add('is-visible'));
}

window.addEventListener('scroll', syncHeader, { passive: true });
window.addEventListener('resize', scrollActiveNav, { passive: true });
window.addEventListener('load', scrollActiveNav);
setTimeout(scrollActiveNav, 80);
syncHeader();
scrollActiveNav();
