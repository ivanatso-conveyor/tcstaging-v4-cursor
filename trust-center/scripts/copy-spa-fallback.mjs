/**
 * GitHub Pages serves 404.html for unknown paths. Copying index.html lets the
 * client-side router handle deep links and refresh on routes like /repo/designerstaging.
 */
import { copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, '..', 'dist');
const indexHtml = join(dist, 'index.html');
const notFoundHtml = join(dist, '404.html');

if (!existsSync(indexHtml)) {
  console.error('copy-spa-fallback: dist/index.html missing. Run vite build first.');
  process.exit(1);
}

copyFileSync(indexHtml, notFoundHtml);
console.log('copy-spa-fallback: wrote dist/404.html');
