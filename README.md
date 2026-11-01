# Monthloom

**Build custom month calendars. Zero runtime dependencies. Any framework.**

[![npm version](https://img.shields.io/npm/v/monthloom)](https://www.npmjs.com/package/monthloom)
[![npm unpacked size](https://img.shields.io/npm/unpacked-size/monthloom)](https://www.npmjs.com/package/monthloom)
[![Runtime dependencies: 0](https://img.shields.io/badge/runtime_dependencies-0-brightgreen)](https://www.npmjs.com/package/monthloom?activeTab=dependencies)
[![CI](https://github.com/goudam-jm/Monthloom/actions/workflows/ci.yml/badge.svg)](https://github.com/goudam-jm/Monthloom/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/monthloom)](./LICENSE)

Get a month as an array of weeks, then render it with your own markup and state. Use it in React, Vue, vanilla JavaScript, or on the server. An optional browser widget is available when you want a simple calendar without building a view.

```sh
npm install monthloom
```

```js
import { getMonthGrid } from 'monthloom';

// February 2024. Months are zero-based, like JavaScript Date.
const weeks = getMonthGrid(2024, 1, { weekStartsOn: 1 });
console.log(weeks[0].map(date => date?.getDate() ?? null));
// [null, null, null, 1, 2, 3, 4]
```

**[Playground](https://goudam-jm.github.io/Monthloom/) · [Recipes](https://goudam-jm.github.io/Monthloom/examples/vanilla.html) · [Step-by-step tutorial](https://goudam-jm.github.io/Monthloom/tutorial.html)**

## Choose Monthloom when

You want month grids and navigation, but want to own the UI, styling, and selection state. It handles week padding, leap years, adjacent-month days, and clamped month arithmetic.

- Compared with [calendarize](https://github.com/lukeed/calendarize), Monthloom returns `Date | null` cells rather than day numbers, and includes fixed six-week layouts, localized labels, month navigation, and an optional widget.
- Already using date-fns or Day.js for general date calculations? Keep them if they meet your needs; Monthloom focuses on month-shaped data.
- Need a full date picker with range selection, disabled-date rules, and calendar keyboard navigation? Consider [React DayPicker](https://daypicker.dev/). Monthloom's widget does not implement those features.
- Need event scheduling or resource timelines? Use a scheduling library. Monthloom has no scheduling engine.

## Runnable examples

No framework adapter packages are needed. Each example has a complete source file:

- **[Vanilla JavaScript](https://goudam-jm.github.io/Monthloom/examples/vanilla.html)** — three custom calendar recipes. [Source](./docs/examples/recipes.js).
- **[React](https://goudam-jm.github.io/Monthloom/examples/react.html)** — month navigation and app-owned selection. [Source](./docs/examples/react.js).
- **[Vue](https://goudam-jm.github.io/Monthloom/examples/vue.html)** — the same headless approach with reactive state. [Source](./docs/examples/vue.js).

The hosted examples import the repository's source modules. React and Vue load from pinned third-party CDN URLs. In a bundled app, replace `../lib/index.js` with `monthloom` and install your framework normally. To run examples locally: `npm ci`, `npm run build:pages`, then `python3 -m http.server --directory _site`. Open the printed URL and choose an example.

## Three recipes, one core

- **Booking availability:** disable unavailable days and store a selected date in your app. The example does not reserve anything or validate server availability.
- **Habit tracker:** toggle completed days using an app-owned `Set` and `aria-pressed` buttons. Demo state resets on reload.
- **Event-marked month:** attach event records to dates and render them beside the day. Fetching, recurrence, and scheduling stay in your app.

[Try all three](https://goudam-jm.github.io/Monthloom/examples/vanilla.html) or [follow the tutorial](https://goudam-jm.github.io/Monthloom/tutorial.html).

## Calendar utilities

```js
import { Calendar, addMonths, getWeekdayLabels } from 'monthloom';

new Calendar(new Date(2024, 11, 1)).next().getMonthString(); // "January"
getWeekdayLabels({ locale: 'fr-FR', weekStartsOn: 1 });
addMonths(new Date(2024, 0, 31), 1); // February 29, 2024
```

CommonJS works through `require('monthloom')`. TypeScript declarations are included. Both JavaScript entry points can be imported without a browser.

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

## Package size and dependencies

The size badge reads the latest published **unpacked npm package** size, including documentation, declarations, and both module formats. It is not the browser download size. Version 0.1.0 reports **25,615 bytes unpacked** in the [npm registry metadata](https://registry.npmjs.org/monthloom/0.1.0).

There are **zero runtime, optional, or peer dependencies**; CI checks this claim. Development tools are not runtime dependencies.

Run `npm run size` for the current source's minified ESM and gzip byte counts. The command uses the locked esbuild version, bundles all exports, and targets ES2022. It measures the core and the widget including its imported core separately; stylesheet bytes are excluded. For the unchanged 0.1.0 library source, this toolchain measures **875 bytes gzip for all core exports**, or **1,592 bytes gzip for the widget plus core**. These are measurement snapshots; rerun after source or tooling changes. Individual named imports can produce different bundles. No "smallest" or "fastest" claim is made.

## Compatibility and limits

- Runtime: Node.js 20+; CI currently tests Node.js 22 and 24 in UTC, Los Angeles, and Auckland time zones.
- Browser code requires ES modules, private class fields, and Intl with `dateStyle`. The widget additionally requires DOM APIs such as `replaceChildren`. Use a modern evergreen browser; a cross-browser release matrix has not been verified.
- Gregorian calendar only. Locale changes labels, not the underlying calendar system. Dates are local civil dates, not a time-zone conversion API.
- TypeScript: strict ESM and CommonJS consumer fixtures are compiled in CI. A minimum supported TypeScript version has not been established.
- The optional widget has native buttons, table headers, and date labels, but no arrow-key grid navigation, persisted selection, range selection, disabled-date rules, or full accessibility certification. Navigation labels are currently English.

## Development

Use Node.js 24 for development; install the locked tooling with `npm ci`.

```sh
npm ci
npm run check       # build, Pages build, runtime tests, TypeScript consumers
npm run size        # reproducible minified/gzip measurements
npm pack --dry-run  # inspect package contents
```

The library build emits ESM, CommonJS, and declarations into `dist/`. Tests cover a 400-year Gregorian cycle, month boundaries, locales, DOM lifecycle, both package entry points, recipe state, and Pages link resolution. The Pages build copies the actual source modules; it does not rely on a CDN copy of Monthloom. Deployments run from `master`.

## Migrating from the prototype

The original browser demo is preserved in `legacy/index.html`. The package replaces global scripts and cached `CalendarViewManager`/`Stack` navigation with module imports, immutable calendar navigation, and `createCalendar`. Constructors now accept valid `Date` objects rather than environment-dependent date strings. `getWeeks()` returns an array of complete weeks with `null` padding, replacing the original object with keys 1–6 and `undefined` padding. No globals or `window.onload` handlers are installed.

## Releases and license

[Release notes](https://github.com/goudam-jm/Monthloom/blob/master/CHANGELOG.md) · [Publishing guide](./RELEASING.md) · [Report an issue](https://github.com/goudam-jm/Monthloom/issues)

MIT © 2026 Goudam J M. See [LICENSE](./LICENSE).
