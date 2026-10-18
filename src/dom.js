import { Calendar, getWeekdayLabels } from './index.js';

/** Mount an independent widget. No DOM is accessed until this function runs. */
export function createCalendar(element, options = {}) {
  if (!element || typeof element.replaceChildren !== 'function' || !element.ownerDocument) throw new TypeError('element must be a DOM element');
  const { locale = 'en-US', onSelect, ...gridOptions } = options;
  let calendar = new Calendar(options.date);
  let destroyed = false;
  const doc = element.ownerDocument;
  const root = doc.createElement('div');
  root.className = 'calendarjs';
  function make(tag, text) {
    const node = doc.createElement(tag);
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function render() {
    if (destroyed) throw new Error('Calendar has been destroyed');
    const header = make('div');
    header.className = 'calendarjs-header';
    for (const [label, amount] of [['Previous month', -1], ['Next month', 1]]) {
      const button = make('button', amount < 0 ? '‹' : '›');
      button.type = 'button';
      button.setAttribute('aria-label', label);
      button.disabled = amount < 0 ? calendar.getYear() === 1 && calendar.getMonth() === 0 : calendar.getYear() === 9999 && calendar.getMonth() === 11;
      button.addEventListener('click', () => {
        calendar = calendar.next(amount);
        render();
        root.querySelector(`button[aria-label="${label}"]`).focus();
      });
      header.append(button);
    }
    const title = make('span', `${calendar.getMonthString(locale)} ${calendar.getYear()}`);
    title.setAttribute('aria-live', 'polite');
    header.insertBefore(title, header.lastChild);
    const table = make('table');
    const caption = make('caption', title.textContent);
    table.append(caption);
    const head = make('thead');
    const labels = make('tr');
    for (const label of getWeekdayLabels({ locale, weekStartsOn: options.weekStartsOn })) {
      const cell = make('th', label);
      cell.scope = 'col';
      labels.append(cell);
    }
    head.append(labels);
    table.append(head);
    const body = make('tbody');
    const today = new Date().toDateString();
    for (const week of calendar.getWeeks(gridOptions)) {
      const row = make('tr');
      for (const date of week) {
        const cell = make('td');
        if (date) {
          const button = make('button', String(date.getDate()));
          button.type = 'button';
          button.setAttribute('aria-label', new Intl.DateTimeFormat(locale, { dateStyle: 'full' }).format(date));
          if (date.toDateString() === today) button.setAttribute('aria-current', 'date');
          if (date.getMonth() !== calendar.getMonth()) cell.className = 'calendarjs-outside';
          button.addEventListener('click', () => onSelect?.(new Date(date)));
          cell.append(button);
        }
        row.append(cell);
      }
      body.append(row);
    }
    table.append(body);
    root.replaceChildren(header, table);
  }
  render();
  element.append(root);
  return {
    getDate: () => calendar.date,
    setDate(date) {
      if (destroyed) throw new Error('Calendar has been destroyed');
      calendar = new Calendar(date);
      render();
    },
    destroy() { destroyed = true; root.remove(); }
  };
}
