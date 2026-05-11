export const PREVIEW_LOCALES = ['en', 'fr', 'de', 'ja', 'pt', 'es'] as const;
export type PreviewLocale = (typeof PREVIEW_LOCALES)[number];

/** Display name key when the Published tab shows one Trust Center row (not per-language rows). */
export const PRIMARY_TRUST_CENTER_LOCALE: PreviewLocale = 'en';

export type LanguageMenuItem = {
  locale: PreviewLocale;
  label: string;
  /** Live badge in language picker (design parity) */
  live?: boolean;
};

export const LANGUAGE_MENU: readonly LanguageMenuItem[] = [
  { locale: 'en', label: 'English (US)' },
  { locale: 'fr', label: 'French' },
  { locale: 'de', label: 'German' },
  { locale: 'ja', label: 'Japanese' },
  { locale: 'pt', label: 'Portuguese' },
  { locale: 'es', label: 'Spanish' },
] as const;

export function previewLocaleLabel(locale: PreviewLocale): string {
  return LANGUAGE_MENU.find((o) => o.locale === locale)?.label ?? 'English (US)';
}

/** Default “live for visitors” flags per locale (designer prototype). */
export function defaultLocaleLive(): Record<PreviewLocale, boolean> {
  const r = {} as Record<PreviewLocale, boolean>;
  for (const item of LANGUAGE_MENU) {
    r[item.locale] = item.live === true;
  }
  return r;
}
