import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
const output = new URL('../_site/', import.meta.url);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(new URL('../docs/', import.meta.url), output, { recursive: true });
await mkdir(new URL('lib/', output), { recursive: true });
for (const file of ['index.js', 'dom.js', 'styles.css']) {
  await cp(new URL(`../src/${file}`, import.meta.url), new URL(`lib/${file}`, output));
}
await writeFile(new URL('.nojekyll', output), '');
console.log('GitHub Pages demo built in _site/');
