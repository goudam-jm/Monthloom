import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHTML } from 'linkedom';
import { readFile, access, readdir } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mountRecipes } from '../_site/examples/recipes.js';

test('booking, habit, and event recipes retain app-owned state', () => {
  const { document } = parseHTML('<main><p id="recipe-status"></p><div id="booking"></div><div id="habits"></div><div id="events"></div></main>');
  mountRecipes(document);
  const booking = document.querySelectorAll('#booking button');
  assert.equal(booking.length, 29);
  assert.equal(booking[2].disabled, true);
  booking[0].click();
  booking[1].click();
  assert.equal(booking[0].getAttribute('aria-pressed'), 'false');
  assert.equal(booking[1].getAttribute('aria-pressed'), 'true');
  assert.match(document.getElementById('recipe-status').textContent, /no reservation/);
  const habit = document.querySelector('#habits button');
  assert.equal(habit.getAttribute('aria-pressed'), 'true');
  habit.click();
  assert.equal(habit.getAttribute('aria-pressed'), 'false');
  habit.click();
  assert.equal(habit.getAttribute('aria-pressed'), 'true');
  assert.match(document.querySelector('#events').textContent, /Community meetup/);
});

test('built site local links and script imports resolve under the project base path', async () => {
  const root = fileURLToPath(new URL('../_site/', import.meta.url));
  async function check(directory) {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) { await check(path); continue; }
      if (!path.endsWith('.html') && !path.endsWith('.js')) continue;
      const text = await readFile(path, 'utf8');
      const links = path.endsWith('.html')
        ? [...text.matchAll(/(?:href|src)="([^"#]+)"/g)].map(match => match[1])
        : [...text.matchAll(/from ['"]([^'"]+)['"]/g)].map(match => match[1]);
      for (const link of links.filter(link => link.startsWith('.'))) {
        const target = resolve(dirname(path), link.split('#')[0]);
        assert.ok(!relative(root, target).startsWith('..'), `Link escapes Pages base: ${link}`);
        await access(target);
      }
    }
  }
  await check(root);
});

test('runtime dependency claim matches the manifest', async () => {
  const pkg = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
  assert.deepEqual(pkg.dependencies ?? {}, {});
  assert.deepEqual(pkg.optionalDependencies ?? {}, {});
  assert.deepEqual(pkg.peerDependencies ?? {}, {});
});
