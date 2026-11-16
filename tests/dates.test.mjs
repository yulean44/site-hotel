import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dayAfter, formatDate, toISODate } from '../scripts/dates.js';

test('saída mínima avança no fim de mês, ano e fevereiro bissexto', () => {
  assert.equal(dayAfter('2026-12-31'), '2027-01-01');
  assert.equal(dayAfter('2026-02-28'), '2026-03-01');
  assert.equal(dayAfter('2028-02-28'), '2028-02-29');
  assert.equal(dayAfter('2028-02-29'), '2028-03-01');
});

test('datas da reserva respeitam o calendário local e o português', () => {
  assert.equal(toISODate(new Date(2026, 10, 16, 23, 59)), '2026-11-16');
  assert.equal(formatDate('2026-11-16'), '16/11/2026');
});

test('trocas de horário de verão não pulam dias na saída', () => {
  assert.equal(dayAfter('2026-03-07'), '2026-03-08');
  assert.equal(dayAfter('2026-03-08'), '2026-03-09');
  assert.equal(dayAfter('2026-11-01'), '2026-11-02');
});
