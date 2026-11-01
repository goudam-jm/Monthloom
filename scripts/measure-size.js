import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';

for (const entry of ['src/index.js', 'src/dom.js']) {
  const result = await build({ entryPoints: [entry], bundle: true, minify: true, format: 'esm', target: 'es2022', write: false });
  assert.equal(result.outputFiles.length, 1, 'Expected one browser bundle');
  const bytes = result.outputFiles[0].contents;
  assert.ok(bytes.byteLength > 0, 'Bundle must not be empty');
  console.log(`${entry}: ${bytes.byteLength} bytes minified, ${gzipSync(bytes).byteLength} bytes gzip`);
}
