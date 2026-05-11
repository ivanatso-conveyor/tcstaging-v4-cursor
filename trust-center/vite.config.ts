import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const trustCenterRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(trustCenterRoot, '..');

/** GitHub Pages uses /<repo>/; set VITE_BASE_PATH in CI (see .github/workflows/deploy-github-pages.yml). */
function normalizeBase(raw: string | undefined): string {
  const p = (raw ?? '/').trim() || '/';
  if (p === '/') return '/';
  const withLeading = p.startsWith('/') ? p : `/${p}`;
  return withLeading.endsWith('/') ? withLeading : `${withLeading}/`;
}

export default defineConfig({
  base: normalizeBase(process.env.VITE_BASE_PATH),
  plugins: [react(), tailwindcss()],
  server: {
    // Avoid stale JS/CSS during iteration (helps when the browser skips a hard refresh).
    headers: { 'Cache-Control': 'no-store' },
    fs: {
      allow: [trustCenterRoot, workspaceRoot],
    },
  },
})
