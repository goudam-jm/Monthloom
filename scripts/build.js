import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
await mkdir(new URL('../dist/', import.meta.url), { recursive: true });
for (const name of ['index', 'dom']) {
  const source = await readFile(new URL(`../src/${name}.js`, import.meta.url), 'utf8');
  const names = [...source.matchAll(/export (?:function|class) (\w+)/g)].map(match => match[1]);
  const commonjs = source.replace("import { Calendar, getWeekdayLabels } from './index.js';", "const { Calendar, getWeekdayLabels } = require('./index.cjs');").replace(/export (function|class) /g, '$1 ');
  await writeFile(new URL(`../dist/${name}.js`, import.meta.url), source);
  await writeFile(new URL(`../dist/${name}.cjs`, import.meta.url), `'use strict';\n${commonjs}\nmodule.exports = { ${names.join(', ')} };\n`);
  await writeFile(new URL(`../dist/${name}.d.ts`, import.meta.url), await readFile(new URL(`../src/${name}.d.ts`, import.meta.url)));
}
