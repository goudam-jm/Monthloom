import { Calendar, getMonthGrid, getWeekdayLabels, addMonths, daysInMonth } from './lib/index.js';
import { createCalendar } from './lib/dom.js';

const $ = id => document.getElementById(id);
const dateKey = date => `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
const pretty = date => new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(date);
function parseCivil(value) {
  const parts = value.split('-').map(Number);
  if (parts.length < 2 || parts.some(part => !Number.isInteger(part))) throw new Error('Choose a valid date.');
  const [year, month, day = 1] = parts;
  if (day < 1 || day > daysInMonth(year, month - 1)) throw new Error('Choose a valid date.');
  const date = new Date(0);
  date.setFullYear(year, month - 1, day);
  date.setHours(12, 0, 0, 0);
  return date;
}
function listen(ids, render) {
  for (const id of ids) $(id).addEventListener('input', render);
  render();
}
let widget;
function renderWidget() {
  const date = widget?.getDate() ?? new Date();
  widget?.destroy();
  const locale = $('widget-locale').value;
  const weekStartsOn = Number($('widget-week').value);
  widget = createCalendar($('widget'), {
    date, locale, weekStartsOn,
    onSelect(selected) {
      $('selection').textContent = `onSelect → ${new Intl.DateTimeFormat(locale, { dateStyle: 'long' }).format(selected)}`;
    }
  });
  $('widget-code').textContent = `import { createCalendar } from 'monthloom/dom';\nimport 'monthloom/styles.css';\n\nconst widget = createCalendar(element, {\n  locale: '${locale}',\n  weekStartsOn: ${weekStartsOn},\n  onSelect(date) { console.log(date); }\n});`;
}
listen(['widget-locale', 'widget-week'], renderWidget);
$('widget-today').addEventListener('click', () => {
  widget.setDate(new Date());
  $('selection').textContent = 'Select a day to try the callback.';
});
function renderGrid() {
  try {
    const date = parseCivil($('grid-month').value);
    const options = {
      weekStartsOn: Number($('grid-week').value),
      fixedWeeks: $('grid-fixed').checked,
      showOutsideDays: $('grid-outside').checked
    };
    const year = date.getFullYear();
    const month = date.getMonth();
    const weeks = getMonthGrid(year, month, options);
    $('grid-code').textContent = `import { getMonthGrid } from 'monthloom';\n\nconst weeks = getMonthGrid(${year}, ${month}, {\n  weekStartsOn: ${options.weekStartsOn},\n  fixedWeeks: ${options.fixedWeeks},\n  showOutsideDays: ${options.showOutsideDays}\n});`;
    const table = document.createElement('table');
    table.className = 'custom-grid';
    const caption = table.createCaption();
    caption.textContent = `${new Calendar(date).getMonthString()} ${year}`;
    const header = table.createTHead().insertRow();
    for (const label of getWeekdayLabels({ weekStartsOn: options.weekStartsOn })) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = label;
      header.append(th);
    }
    const body = table.createTBody();
    for (const week of weeks) {
      const row = body.insertRow();
      for (const date of week) {
        const cell = row.insertCell();
        cell.textContent = date ? String(date.getDate()) : '';
        if (date && date.getMonth() !== month) cell.className = 'outside';
      }
    }
    $('grid-view').replaceChildren(table);
    $('grid-count').textContent = `${weeks.length} weeks · ${daysInMonth(year, month)} days`;
    $('grid-data').textContent = '// Date objects displayed as local YYYY-MM-DD strings\n' + JSON.stringify(weeks.map(week => week.map(date => date ? dateKey(date) : null)), null, 2);
  } catch (error) {
    $('grid-view').textContent = error.message;
    $('grid-count').textContent = '';
    $('grid-data').textContent = '';
    $('grid-code').textContent = '// Choose a valid month to generate a grid.';
  }
}
listen(['grid-month', 'grid-week', 'grid-fixed', 'grid-outside'], renderGrid);
function renderMath() {
  try {
    const date = parseCivil($('math-date').value);
    const amount = $('math-amount').value === '' ? NaN : Number($('math-amount').value);
    const result = addMonths(date, amount);
    $('math-from').textContent = `${pretty(date)} ${amount < 0 ? '−' : '+'} ${Math.abs(amount)} month${Math.abs(amount) === 1 ? '' : 's'}`;
    $('math-result').textContent = pretty(result);
    $('math-caption').textContent = result.getDate() !== date.getDate() ? `Clamped to day ${result.getDate()}: the last valid day of the target month.` : 'Same day of the month. Original date unchanged.';
    $('math-code').textContent = `import { addMonths } from 'monthloom';\n\nconst start = new Date(0);\nstart.setFullYear(${date.getFullYear()}, ${date.getMonth()}, ${date.getDate()});\nconst result = addMonths(start, ${amount});\n// ${dateKey(result)}`;
  } catch (error) {
    $('math-from').textContent = 'Try another date or month offset';
    $('math-result').textContent = 'Outside the valid range';
    $('math-caption').textContent = error.message;
    $('math-code').textContent = '// Choose a valid date and integer month offset.';
  }
}
listen(['math-date', 'math-amount'], renderMath);
function renderLabels() {
  const locale = $('labels-locale').value;
  const width = $('labels-width').value;
  const weekStartsOn = Number($('labels-week').value);
  const labels = getWeekdayLabels({ locale, width, weekStartsOn });
  $('labels-view').replaceChildren(...labels.map((label, index) => {
    const item = document.createElement('div');
    item.className = 'label-item';
    const number = document.createElement('span');
    number.textContent = String(index + 1).padStart(2, '0');
    const text = document.createElement('span');
    text.lang = locale;
    text.dir = 'auto';
    text.textContent = label;
    item.append(number, text);
    return item;
  }));
  $('labels-code').textContent = `import { getWeekdayLabels } from 'monthloom';\n\ngetWeekdayLabels({\n  locale: '${locale}',\n  width: '${width}',\n  weekStartsOn: ${weekStartsOn}\n});\n// ${JSON.stringify(labels)}`;
}
listen(['labels-locale', 'labels-width', 'labels-week'], renderLabels);
