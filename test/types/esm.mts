import { Calendar, getMonthGrid, getWeekdayLabels, addMonths, daysInMonth } from 'monthloom';
import type { GridOptions } from 'monthloom';
import { createCalendar } from 'monthloom/dom';
const options: GridOptions = { weekStartsOn: 1, fixedWeeks: true };
const cells: (Date | null)[][] = getMonthGrid(2024, 1, options);
const label: string = new Calendar().next().getMonthString('fr');
const days: number = daysInMonth(2024, 1);
const date: Date = addMonths(new Date(), 1);
getWeekdayLabels({ width: 'long' });
const widget = createCalendar(document.createElement('div'), { onSelect: selected => selected.getFullYear() });
widget.destroy();
// @ts-expect-error Invalid label widths must fail type checking.
getWeekdayLabels({ width: 'wide' });
void [cells, label, days, date];
