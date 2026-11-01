import calendar = require('monthloom');
import dom = require('monthloom/dom');
const weeks: (Date | null)[][] = calendar.getMonthGrid(2024, 1);
const widget = dom.createCalendar(document.createElement('div'));
widget.setDate(new Date());
void weeks;
