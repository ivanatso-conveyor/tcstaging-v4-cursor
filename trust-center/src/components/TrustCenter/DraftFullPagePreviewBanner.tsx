/**
 * DraftFullPagePreviewBanner
 * Full-width strip at the top of `/trust-center?draftPreview=1` so the standalone draft mirror
 * reads clearly as a named draft preview, not the live visitor page.
 *
 * Figma: Trust Center Vision HQ > Designer > Full-page draft preview (May 2026)
 */
type DraftFullPagePreviewBannerProps = {
  /** Active draft display name (matches the designer draft row label). */
  draftName: string;
};

export default function DraftFullPagePreviewBanner({ draftName }: DraftFullPagePreviewBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex w-full shrink-0 items-center justify-center border-b border-primary-400 bg-draft-preview-banner-bg px-4 py-2.5 text-center"
    >
      <p className="text-xs font-medium leading-relaxed text-primary-800">
        Draft Preview: {draftName}.
      </p>
    </div>
  );
}
