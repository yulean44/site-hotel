import { trapFocus, setBackgroundInert } from './focus.js';

const weddingModal = document.querySelector('[data-wedding-modal]');

if (weddingModal) {
  const weddingImages = Array.from({ length: 42 }, (_, index) =>
    `assets/images/optimized/noite-de-nupcias/noite-${String(index + 1).padStart(2, '0')}.webp`
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
    setBackgroundInert(weddingModal, false);
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
    setBackgroundInert(weddingModal, true);
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
  const requestedTrigger = requestedPackage ? [...document.querySelectorAll('[data-wedding-open]')].find(button => button.dataset.weddingOpen === requestedPackage) : null;
  if (requestedTrigger) openWeddingModal(requestedPackage, requestedTrigger);
}
