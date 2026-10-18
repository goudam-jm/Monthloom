import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { Calendar, daysInMonth, addMonths, getMonthGrid, getWeekdayLabels } from '../src/index.js';
import { createCalendar } from '../src/dom.js';
import { parseHTML } from 'linkedom';

test('Gregorian leap years and zero-based month validation', () => {
  assert.equal(daysInMonth(2024, 1), 29);
  assert.equal(daysInMonth(1900, 1), 28);
  assert.equal(daysInMonth(2000, 1), 29);
  assert.equal(daysInMonth(99, 1), 28);
  for (const args of [[0, 0], [2024, 12], [NaN, 0], [2024, 1.5]]) assert.throws(() => daysInMonth(...args), RangeError);
});
test('grids contain every day once, padded to complete weeks across 400 years', () => {
  for (let year = 2000; year < 2400; year++) for (let month = 0; month < 12; month++) for (const weekStartsOn of [0, 1, 6]) {
    const weeks = getMonthGrid(year, month, { weekStartsOn });
    assert.ok(weeks.length >= 4 && weeks.length <= 6);
    assert.ok(weeks.every(week => week.length === 7));
    const dates = weeks.flat().filter(Boolean);
    assert.equal(dates.length, daysInMonth(year, month));
    assert.deepEqual(dates.map(date => date.getDate()), Array.from({ length: dates.length }, (_, i) => i + 1));
    assert.equal(weeks.flat().findIndex(Boolean), (dates[0].getDay() - weekStartsOn + 7) % 7);
  }
});
test('fixed grids, adjacent days, and localized labels', () => {
  const weeks = getMonthGrid(2024, 1, { fixedWeeks: true, showOutsideDays: true, weekStartsOn: 1 });
  assert.equal(weeks.length, 6);
  assert.equal(weeks[0][0].getMonth(), 0);
  assert.equal(weeks[0][0].getDate(), 29);
  assert.deepEqual(getWeekdayLabels({ weekStartsOn: 1 }), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  assert.equal(getWeekdayLabels({ locale: 'fr', width: 'long' })[0], 'dimanche');
  assert.throws(() => getMonthGrid(2024, 0, { weekStartsOn: 7 }), RangeError);
});
test('month arithmetic clamps days, crosses years, and does not mutate inputs', () => {
  const date = new Date(2024, 0, 31);
  assert.equal(addMonths(date, 1).getDate(), 29);
  assert.equal(date.getMonth(), 0);
  assert.equal(addMonths(date, -1).getFullYear(), 2023);
  const calendar = new Calendar(date);
  assert.equal(calendar.previous().getMonth(), 11);
  assert.equal(calendar.next(12).getYear(), 2025);
  calendar.date.setFullYear(2000);
  calendar.getWeeks()[0].fill(null);
  assert.equal(calendar.getYear(), 2024);
  assert.ok(calendar.getWeeks().flat().some(Boolean));
  assert.throws(() => new Calendar(new Date('invalid')), TypeError);
  assert.throws(() => addMonths(date, Infinity), RangeError);
  assert.throws(() => new Calendar(new Date(9999, 11, 1)).next(), RangeError);
});
test('DOM widget navigation, selection, independent instances and cleanup', () => {
  const { document } = parseHTML('<html><body><main><p>Keep</p></main><aside></aside></body></html>');
  const main = document.querySelector('main');
  let selected;
  const widget = createCalendar(main, { date: new Date(2024, 11, 1), onSelect: date => { selected = date; } });
  const other = createCalendar(document.querySelector('aside'), { date: new Date(2020, 0, 1) });
  main.querySelector('[aria-label="Next month"]').click();
  assert.equal(widget.getDate().getFullYear(), 2025);
  assert.equal(widget.getDate().getMonth(), 0);
  assert.equal(other.getDate().getFullYear(), 2020);
  main.querySelector('td button').click();
  assert.equal(selected.getDate(), 1);
  assert.equal(selected.getFullYear(), 2025);
  widget.setDate(new Date(2024, 1, 1));
  assert.equal(main.querySelectorAll('td button').length, 29);
  widget.destroy();
  widget.destroy();
  assert.equal(main.textContent, 'Keep');
  assert.throws(() => widget.setDate(new Date()), /destroyed/);
});
test('built ESM and CommonJS package entry points are usable without DOM globals', async () => {
  const esm = await import('monthloom');
  const require = createRequire(import.meta.url);
  const cjs = require('monthloom');
  assert.equal(esm.daysInMonth(2024, 1), cjs.daysInMonth(2024, 1));
  assert.equal(typeof require('monthloom/dom').createCalendar, 'function');
  assert.equal(typeof (await import('monthloom/dom')).createCalendar, 'function');
});
