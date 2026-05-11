/**
 * Logo.dev Image CDN — https://docs.logo.dev/introduction
 * Requires `VITE_LOGO_DEV_TOKEN` in `.env.local` (publishable `pk_` key — not the secret `sk_` key).
 */

function normalizeToken(raw: string | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const t = raw.replace(/^\uFEFF/, '').trim();
  return t || null;
}

if (import.meta.env.DEV && !normalizeToken(import.meta.env.VITE_LOGO_DEV_TOKEN)) {
  console.warn(
    '[Logo.dev] VITE_LOGO_DEV_TOKEN is missing. Add it to trust-center/.env.local, restart `npm run dev`, and run the dev server from the trust-center folder.',
  );
}

/** One-shot dev check: Logo.dev returns 404 + JSON if the publishable key is wrong. */
function schedulePublishableKeyCheck() {
  if (!import.meta.env.DEV || typeof window === 'undefined') return;
  const token = normalizeToken(import.meta.env.VITE_LOGO_DEV_TOKEN);
  if (!token) return;

  queueMicrotask(async () => {
    try {
      const res = await fetch(
        `https://img.logo.dev/stripe.com?token=${encodeURIComponent(token)}&size=64`,
        { method: 'HEAD', cache: 'no-store' },
      );
      if (res.ok) return;

      const text = await res.text().catch(() => '');
      let detail = text.slice(0, 200);
      try {
        const j = JSON.parse(text) as { msg?: string };
        if (j.msg) detail = j.msg;
      } catch {
        /* keep raw */
      }
      console.warn('[Logo.dev] Publishable key was rejected (HTTP ' + res.status + '):', detail || '(empty body)');
      console.warn(
        '[Logo.dev] Use the Publishable (pk_) key from https://www.logo.dev/dashboard/api-keys — paste into trust-center/.env.local as VITE_LOGO_DEV_TOKEN=… then restart `npm run dev`.',
      );
    } catch {
      /* network blocked / offline */
    }
  });
}

schedulePublishableKeyCheck();

export function getLogoDevImageSrc(domain: string, options?: { size?: number }): string | null {
  const token = normalizeToken(import.meta.env.VITE_LOGO_DEV_TOKEN);
  const d = domain?.trim();
  if (!d || !token) return null;
  const size = options?.size ?? 128;
  return `https://img.logo.dev/${encodeURIComponent(d)}?token=${encodeURIComponent(token)}&size=${size}`;
}
