import { toISODate, dayAfter, formatDate } from './dates.js';

const homeBooking = document.querySelector('[data-home-booking]');

if (homeBooking) {
  const checkin = homeBooking.elements.checkin;
  const checkout = homeBooking.elements.checkout;
  const adults = homeBooking.elements.adults;
  const children = homeBooking.elements.children;
  const pets = homeBooking.elements.pets;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  checkin.min = toISODate(today);
  checkin.value = toISODate(today);
  checkout.min = toISODate(tomorrow);
  checkout.value = toISODate(tomorrow);

  checkin.addEventListener('change', () => {
    if (!checkin.value) return;
    checkout.min = dayAfter(checkin.value);
    if (!checkout.value || checkout.value <= checkin.value) checkout.value = checkout.min;
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
    steppers.forEach(stepper => {
      const count = Number(stepper.querySelector('input').value);
      stepper.querySelector('[data-guest-minus]').disabled = count <= Number(stepper.dataset.min);
      stepper.querySelector('[data-guest-plus]').disabled = count >= Number(stepper.dataset.max);
    });
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

  guestPicker.addEventListener('focusout', () => {
    requestAnimationFrame(() => {
      if (!guestPicker.contains(document.activeElement)) closeGuestPicker();
    });
  });
  updateGuestSummary();
}
