import { Calendar, getWeekdayLabels } from '../lib/index.js';

// This demo owns availability, events, and completion state; Monthloom only supplies dates.
export function mountRecipes(document) {
  const calendar = new Calendar(new Date(2024, 1, 1));
  const unavailable = new Set([3, 4, 10, 11, 17, 18, 24, 25]);
  const completed = new Set([1, 2, 5, 6, 8]);
  const events = new Map([[7, 'Design review'], [15, 'Community meetup'], [22, 'Release day']]);
  const status = document.getElementById('recipe-status');
  for (const kind of ['booking', 'habits', 'events']) {
    const host = document.getElementById(kind);
    const table = document.createElement('table');
    table.className = 'custom-grid';
    const caption = document.createElement('caption');
    caption.textContent = `${calendar.getMonthString()} ${calendar.getYear()}`;
    table.append(caption);
    const head = document.createElement('thead');
    const labels = document.createElement('tr');
    for (const label of getWeekdayLabels({ weekStartsOn: 1 })) {
      const cell = document.createElement('th');
      cell.scope = 'col';
      cell.textContent = label;
      labels.append(cell);
    }
    head.append(labels);
    table.append(head);
    const body = document.createElement('tbody');
    for (const week of calendar.getWeeks({ weekStartsOn: 1 })) {
      const row = document.createElement('tr');
      for (const date of week) {
        const cell = document.createElement('td');
        if (date) {
          const day = date.getDate();
          const label = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(date);
          if (kind === 'events') {
            cell.textContent = String(day);
            if (events.has(day)) {
              const event = document.createElement('small');
              event.textContent = events.get(day);
              cell.append(event);
            }
          } else {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = String(day);
            button.setAttribute('aria-label', label);
            if (kind === 'booking') {
              button.disabled = unavailable.has(day);
              button.setAttribute('aria-pressed', 'false');
              button.addEventListener('click', () => {
                for (const previous of table.querySelectorAll('[aria-pressed="true"]')) previous.setAttribute('aria-pressed', 'false');
                button.setAttribute('aria-pressed', 'true');
                status.textContent = `Selected ${label}. Demo only; no reservation was made.`;
              });
            } else {
              button.setAttribute('aria-pressed', String(completed.has(day)));
              button.addEventListener('click', () => {
                if (completed.has(day)) completed.delete(day);
                else completed.add(day);
                button.setAttribute('aria-pressed', String(completed.has(day)));
                status.textContent = `${completed.size} completed days. Demo state resets on reload.`;
              });
            }
            cell.append(button);
          }
        }
        row.append(cell);
      }
      body.append(row);
    }
    table.append(body);
    host.replaceChildren(table);
  }
}
