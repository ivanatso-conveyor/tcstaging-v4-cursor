/**
 * PUT trust-center/dist to https://api.temp.md/temps/<tempId>, updating an
 * existing temp.md deployment in place (URL stays the same).
 *
 * Reads tempId + updateToken from <repo>/.tempmd (same file format as the
 * one produced by `npm run publish:temp-md`): a single-line pipe-separated
 * record with `Temp ID: ...`, `Update Token: ...`, `URL: ...`, etc.
 *
 * Usage (from trust-center/): npm run build && node scripts/update-temp-md.mjs
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const dist = join(__dirname, '..', 'dist');
const credsPath = join(__dirname, '..', '..', '.tempmd');

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

function guessMime(filePath) {
  const lower = filePath.toLowerCase();
  if (lower.endsWith('.html')) return 'text/html';
  if (lower.endsWith('.css')) return 'text/css';
  if (lower.endsWith('.js')) return 'application/javascript';
  if (lower.endsWith('.svg')) return 'image/svg+xml';
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
  if (lower.endsWith('.webp')) return 'image/webp';
  if (lower.endsWith('.ico')) return 'image/x-icon';
  return 'application/octet-stream';
}

function parseCreds(text) {
  const pick = (label) => {
    const m = text.match(new RegExp(`${label}:\\s*([^|\\n]+?)(?:\\s*\\||\\n|$)`));
    return m ? m[1].trim() : null;
  };
  return {
    tempId: pick('Temp ID'),
    updateToken: pick('Update Token'),
    url: pick('URL'),
  };
}

let creds;
try {
  creds = parseCreds(readFileSync(credsPath, 'utf8'));
} catch (err) {
  console.error(`Could not read ${credsPath}: ${err.message}`);
  console.error('Run `npm run publish:temp-md` first to create a deployment.');
  process.exit(1);
}

if (!creds.tempId || !creds.updateToken) {
  console.error('Missing tempId or updateToken in .tempmd. Re-publish with `npm run publish:temp-md`.');
  process.exit(1);
}

const all = walk(dist);
const indexPath = join(dist, 'index.html');
if (!all.includes(indexPath)) {
  console.error('Missing dist/index.html. Run: npm run build');
  process.exit(1);
}

const form = new FormData();
form.append(
  'file',
  new File([readFileSync(indexPath)], 'index.html', { type: 'text/html' }),
);

for (const full of all) {
  const rel = relative(dist, full).replace(/\\/g, '/');
  if (rel === 'index.html') continue;
  const buf = readFileSync(full);
  const fieldName = `files/${rel}`;
  const baseName = rel.includes('/') ? rel.slice(rel.lastIndexOf('/') + 1) : rel;
  form.append(fieldName, new File([buf], baseName, { type: guessMime(full) }));
}

const endpoint = `https://api.temp.md/temps/${creds.tempId}`;
const res = await fetch(endpoint, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${creds.updateToken}` },
  body: form,
});
const raw = await res.text();
let json;
try {
  json = JSON.parse(raw);
} catch {
  console.error('Non-JSON response', res.status, raw.slice(0, 500));
  process.exit(1);
}

if (!res.ok) {
  console.error('Update failed', res.status, json);
  process.exit(1);
}

console.log(JSON.stringify(json, null, 2));
