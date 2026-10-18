# Monthloom

A small, dependency-free calendar library with an optional vanilla JavaScript widget. Use the calendar data in any framework, on the server, or directly in a browser.

## Interactive demo

[Explore the GitHub Pages playground](https://goudam-jm.github.io/Monthloom/): try the browser widget, configure headless grids, add months to dates, and localize weekday labels. Every example includes code that follows its controls.

Build locally with `npm run build:pages`, then serve `_site/` using a static HTTP server. The demo bundles the repository's source modules and requires no npm publication or CDN. `.github/workflows/pages.yml` deploys changes from `master`. GitHub Pages must use GitHub Actions as its build source, with the `github-pages` environment allowing the deployment branch.

## Install

Install the package with `npm install monthloom`. To build and try a local package:

```sh
npm ci
npm run check
npm pack
# In your consuming project:
npm install /path/to/monthloom-0.1.0.tgz
```

## Calendar data

```js
import { Calendar, getMonthGrid, addMonths } from 'monthloom';

// Months are zero-based: February = 1.
const weeks = getMonthGrid(2024, 1, { weekStartsOn: 1 });
// Date[][] with null for cells outside the month.
const calendar = new Calendar(new Date(2024, 11, 1));
calendar.next().getMonthString(); // "January"
calendar.getMonthString('fr'); // "décembre"
addMonths(new Date(2024, 0, 31), 1); // February 29
```

CommonJS is supported through `require('monthloom')`. TypeScript declarations are included. Importing either entry point is safe without a browser.

### API

- `daysInMonth(year, month)` returns the Gregorian month length.
- `getMonthGrid(year, month, options?)` returns fresh arrays of seven cells per week. Each cell is a fresh `Date` or `null`. Options: `weekStartsOn` (0–6, default Sunday), `fixedWeeks` (always six rows), and `showOutsideDays` (adjacent month dates instead of null).
- `getWeekdayLabels(options?)` returns seven localized weekday names. Options: `locale` (default `en-US`), `weekStartsOn`, and `width` (`long`, `short`, or `narrow`; default `short`).
- `addMonths(date, amount)` returns a new date, clamping the day to the target month. Negative offsets are supported.
- `new Calendar(date?)` represents a month, defaulting to today. `getYear()`, `getYearString()`, `getMonth()`, `getMonthString(locale?)`, and `getWeeks(options?)` read it. `next(amount = 1)` and `previous(amount = 1)` return new calendars. The `date` getter returns a defensive copy of the month's first day.

Dates represent **local civil days at noon**, not timestamps or UTC dates. Time-of-day is discarded. This library does not convert time zones. Use local getters to serialize calendar days; `toISOString()` converts to UTC and may change the date. Supported input years are 1–9999; invalid dates, month indexes, week starts, and out-of-range navigation throw. Outside cells at the supported year boundaries may contain the immediately adjacent year.

## Browser widget

```js
import { createCalendar } from 'monthloom/dom';
import 'monthloom/styles.css'; // Bundlers supporting CSS imports

const widget = createCalendar(document.querySelector('#calendar'), {
  date: new Date(),
  locale: 'en-US',
  weekStartsOn: 1,
  onSelect(date) { console.log(date); }
});

widget.setDate(new Date(2025, 0, 1));
widget.getDate(); // Defensive Date copy
widget.destroy(); // Removes this widget; safe to call repeatedly
```

The widget accepts all grid options. It uses native buttons, labeled navigation, table headers, full date labels, and visible keyboard focus. Date buttons invoke `onSelect`; selection persistence, date-range selection, and arrow-key grid navigation are outside this API. Each mounted widget owns its DOM and navigation state. Mounting appends a widget and preserves existing container children. Calling `setDate` after destruction throws.

Without a bundler, serve the repository with a static HTTP server and import `./src/dom.js` as a module; load `./src/styles.css` through a stylesheet link.

## Development

Node.js 22 or newer is recommended for development. Runtime package exports support Node.js 20+ and modern browsers with ES modules and `Intl`.

```sh
npm ci
npm run check
npm pack --dry-run
```

The build emits ESM, CommonJS, and declarations into `dist/`. Tests cover a 400-year Gregorian cycle, leap years, month boundaries, locales, DOM lifecycle, and both package entry points. CI runs checks in multiple time zones.

## Migrating from the prototype

The original browser demo is preserved in `legacy/index.html`. The package replaces global scripts and cached `CalendarViewManager`/`Stack` navigation with module imports, immutable calendar navigation, and `createCalendar`. Constructors now accept valid `Date` objects rather than environment-dependent date strings. `getWeeks()` returns an array of complete weeks with `null` padding, replacing the original object with keys 1–6 and `undefined` padding. No globals or `window.onload` handlers are installed.

## Releases and license

MIT © 2026 Goudam J M. See [LICENSE](./LICENSE).

See [RELEASING.md](./RELEASING.md) for the first publish, trusted publishing setup, versioning, and the release workflow.
