import mediacoreLogo from '../assets/ui/mediacore-logo.png';
import modernLandingThumb from '../assets/ui/modern-landing.png';
import simpleFormThumb from '../assets/ui/simple-form.png';

/**
 * Trust Center bitmaps. Default hero banner is served from `public/assets/tc-banner.png` so the
 * runtime URL is always `${BASE_URL}assets/tc-banner.png` (stable, no hashed filename, no %20).
 * Other thumbnails stay as bundled imports.
 */
const tcBanner = `${import.meta.env.BASE_URL}assets/tc-banner.png`;

export const uiAssets = {
  tcBanner,
  mediacoreLogo,
  modernLandingThumb,
  simpleFormThumb,
} as const;
