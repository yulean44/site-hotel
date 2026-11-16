import { trapFocus, setBackgroundInert } from './focus.js';

const roomModal = document.querySelector('[data-room-modal]');

if (roomModal) {
  const roomCatalog = {
    standard: {
      title: 'Standard',
      description: 'Apartamentos aconchegantes, localizados em sua maioria na ala hist\u00f3rica. Duas unidades ficam no s\u00f3t\u00e3o, o que lhes confere um charme especial.',
      features: ['Ar-condicionado', 'TV', 'Frigobar', 'Cofre digital', 'Wi-Fi', 'Ala hist\u00f3rica', 'Duas unidades no s\u00f3t\u00e3o'],
      images: Array.from({ length: 5 }, (_, index) => `assets/images/optimized/acomodacoes/standard-${index + 1}.webp`)
    },
    luxo: {
      title: 'Luxo',
      description: 'Onze apartamentos distribu\u00eddos entre a ala hist\u00f3rica e a parte contempor\u00e2nea. Possuem boa \u00e1rea interna e acomodam at\u00e9 tr\u00eas pessoas. Algumas unidades contam com varanda privativa ou vista da cidade; outras ficam pr\u00f3ximas \u00e0 piscina.',
      features: ['At\u00e9 3 h\u00f3spedes', 'Ar-condicionado', 'TV', 'Frigobar', 'Cofre digital', 'Wi-Fi', 'Varanda em algumas unidades', 'Vista da cidade em algumas unidades', 'Unidades pr\u00f3ximas \u00e0 piscina'],
      images: Array.from({ length: 6 }, (_, index) => `assets/images/optimized/acomodacoes/luxo-${index + 1}.webp`)
    },
    'super-luxo': {
      title: 'Super Luxo',
      description: 'Uma acomoda\u00e7\u00e3o exclusiva na parte contempor\u00e2nea, com duas varandas privativas, closet e vista privilegiada da cidade e da Catedral de Caetit\u00e9.',
      features: ['Acomoda\u00e7\u00e3o exclusiva', '2 varandas privativas', 'Closet', 'Vista da Catedral', 'Vista da cidade', 'Ar-condicionado', 'TV', 'Frigobar', 'Cofre digital', 'Wi-Fi'],
      images: Array.from({ length: 6 }, (_, index) => `assets/images/optimized/acomodacoes/super-luxo-${index + 1}.webp`)
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
    setBackgroundInert(roomModal, false);
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
    setBackgroundInert(roomModal, true);
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
  const requestedTrigger = requestedRoom ? [...document.querySelectorAll('[data-room-open]')].find(button => button.dataset.roomOpen === requestedRoom) : null;
  if (requestedTrigger) openRoomModal(requestedRoom, requestedTrigger);
}
