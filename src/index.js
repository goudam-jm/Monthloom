/** Calendar dates use local civil time; months are zero-based, like Date. */
function integer(value, name, min, max) {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new RangeError(`${name} must be an integer from ${min} to ${max}`);
  }
}
function civilDate(year, month, day) {
  const date = new Date(0);
  date.setFullYear(year, month, day);
  date.setHours(12, 0, 0, 0);
  if (!Number.isFinite(date.getTime())) throw new RangeError('Date is outside the supported range');
  return date;
}
function validMonth(year, month) {
  integer(year, 'year', 1, 9999);
  integer(month, 'month', 0, 11);
}
export function daysInMonth(year, month) {
  validMonth(year, month);
  return civilDate(year, month + 1, 0).getDate();
}
export function addMonths(date, amount) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new TypeError('date must be a valid Date');
  integer(amount, 'amount', -119987, 119987);
  const target = civilDate(date.getFullYear(), date.getMonth() + amount, 1);
  validMonth(target.getFullYear(), target.getMonth());
  target.setDate(Math.min(date.getDate(), daysInMonth(target.getFullYear(), target.getMonth())));
  return target;
}
export function getWeekdayLabels({ locale = 'en-US', weekStartsOn = 0, width = 'short' } = {}) {
  integer(weekStartsOn, 'weekStartsOn', 0, 6);
  const format = new Intl.DateTimeFormat(locale, { weekday: width });
  return Array.from({ length: 7 }, (_, i) => format.format(civilDate(2024, 0, 7 + (i + weekStartsOn) % 7)));
}
export function getMonthGrid(year, month, { weekStartsOn = 0, fixedWeeks = false, showOutsideDays = false } = {}) {
  validMonth(year, month);
  integer(weekStartsOn, 'weekStartsOn', 0, 6);
  const offset = (civilDate(year, month, 1).getDay() - weekStartsOn + 7) % 7;
  const count = fixedWeeks ? 42 : Math.ceil((offset + daysInMonth(year, month)) / 7) * 7;
  return Array.from({ length: count / 7 }, (_, row) => Array.from({ length: 7 }, (_, col) => {
    const day = row * 7 + col - offset + 1;
    if (!showOutsideDays && (day < 1 || day > daysInMonth(year, month))) return null;
    return civilDate(year, month, day);
  }));
}
export class Calendar {
  #date;
  constructor(date = new Date()) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new TypeError('date must be a valid Date');
    validMonth(date.getFullYear(), date.getMonth());
    this.#date = civilDate(date.getFullYear(), date.getMonth(), 1);
  }
  get date() { return new Date(this.#date); }
  getYear() { return this.#date.getFullYear(); }
  getYearString() { return String(this.getYear()); }
  getMonth() { return this.#date.getMonth(); }
  getMonthString(locale = 'en-US') { return new Intl.DateTimeFormat(locale, { month: 'long' }).format(this.#date); }
  getWeeks(options) { return getMonthGrid(this.getYear(), this.getMonth(), options); }
  next(amount = 1) { return new Calendar(addMonths(this.#date, amount)); }
  previous(amount = 1) {
    integer(amount, 'amount', -119987, 119987);
    return this.next(-amount);
  }
}
