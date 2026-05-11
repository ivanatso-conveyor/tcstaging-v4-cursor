import { uiAssets } from '../constants/uiAssets';

export type SavedTrustCenterImagery = {
  squareLogoSrc: string | null;
  headerImageSrc: string | null;
  thumbnailImageSrc: string | null;
};

export function emptyTrustCenterImagery(): SavedTrustCenterImagery {
  return {
    squareLogoSrc: null,
    headerImageSrc: null,
    thumbnailImageSrc: null,
  };
}

export function normalizeTrustCenterImagery(
  saved: SavedTrustCenterImagery | null,
): SavedTrustCenterImagery {
  if (!saved) return emptyTrustCenterImagery();
  return {
    squareLogoSrc: saved.squareLogoSrc?.trim() || null,
    headerImageSrc: saved.headerImageSrc?.trim() || null,
    thumbnailImageSrc: saved.thumbnailImageSrc?.trim() || null,
  };
}

export function effectiveSquareLogo(saved: SavedTrustCenterImagery | null): string {
  const s = normalizeTrustCenterImagery(saved).squareLogoSrc;
  return s && s.length > 0 ? s : uiAssets.mediacoreLogo;
}

export function effectiveHeaderBanner(saved: SavedTrustCenterImagery | null): string {
  const s = normalizeTrustCenterImagery(saved).headerImageSrc;
  return s && s.length > 0 ? s : uiAssets.tcBanner;
}

/** Thumbnail has no built-in page slot; null means no custom image. */
export function effectiveThumbnailPreview(saved: SavedTrustCenterImagery | null): string | null {
  const s = normalizeTrustCenterImagery(saved).thumbnailImageSrc;
  return s && s.length > 0 ? s : null;
}
