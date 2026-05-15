/**
 * Designer shell layout — keep toolbar grid columns aligned with `RightPanel` root width.
 * Figma: Designer > three-column shell (left nav, preview, right settings).
 */
export const DESIGNER_RIGHT_PANEL_WIDTH_PX = 360;

/**
 * Horizontal padding for the Trust Center preview chrome (nav + page card).
 * Keep in sync with the page shell `px-*` on the scroll region in `TrustCenterContent.tsx`.
 */
export const DESIGNER_PREVIEW_EDGE_PAD_CLASS = 'px-4 sm:px-6 md:px-8';

/** Max width wrapper for preview chrome — matches the white Trust Center card shell. */
export const DESIGNER_PREVIEW_MAX_WIDTH_CLASS = 'mx-auto w-full max-w-[1360px]';

/**
 * Minimum width (px) for the staging toolbar Publish / Share CTA so switching Draft ↔ Published
 * does not shift the right-side controls (labels differ in length).
 */
export const DESIGNER_STAGING_CTA_MIN_WIDTH_PX = 160;
