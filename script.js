import './scripts/navigation.js';
import './scripts/accents.js';

document.documentElement.classList.add('js');

// Cada página carrega apenas as interações que apresenta.
if (document.querySelector('[data-home-booking]')) import('./scripts/booking.js');
if (document.querySelector('[data-room-modal]')) import('./scripts/rooms.js');
if (document.querySelector('[data-wedding-modal]')) import('./scripts/wedding.js');
