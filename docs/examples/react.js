import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calendar, getWeekdayLabels } from '../lib/index.js';

const h = React.createElement;
function App() {
  const [month, setMonth] = useState(() => new Calendar(new Date()));
  const [selected, setSelected] = useState('');
  const title = `${month.getMonthString()} ${month.getYear()}`;
  return h(React.Fragment, null,
    h('div', { className: 'recipe-nav' },
      h('button', { onClick: () => setMonth(month.previous()), disabled: month.getYear() === 1 && month.getMonth() === 0, 'aria-label': 'Previous month' }, 'Previous'),
      h('span', { 'aria-live': 'polite' }, title),
      h('button', { onClick: () => setMonth(month.next()), disabled: month.getYear() === 9999 && month.getMonth() === 11, 'aria-label': 'Next month' }, 'Next')),
    h('table', { className: 'custom-grid' },
      h('caption', null, title),
      h('thead', null, h('tr', null, ...getWeekdayLabels({ weekStartsOn: 1 }).map((label, index) => h('th', { scope: 'col', key: index }, label)))),
      h('tbody', null, ...month.getWeeks({ weekStartsOn: 1 }).map((week, row) => h('tr', { key: row }, ...week.map((date, col) => h('td', { key: col }, date && h('button', {
        type: 'button',
        'aria-label': date.toDateString(),
        'aria-pressed': selected === date.toDateString(),
        onClick: () => setSelected(date.toDateString())
      }, date.getDate()))))))),
    h('p', { role: 'status' }, selected || 'Choose a date. Selection belongs to React state.'));
}
createRoot(document.getElementById('app')).render(h(App));
