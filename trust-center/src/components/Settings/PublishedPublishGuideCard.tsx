type PublishedPublishGuideCardProps = {
  /** When true, the primary button is disabled (no draft to publish). */
  isPublishDisabled: boolean;
  /** Opens the same publish confirmation flow as the staging toolbar. */
  onPublishNow: () => void;
  /** Switches the right panel to the Draft tab (matches copy in Step 1). */
  onGoToDraftTab: () => void;
};

/**
 * PublishedPublishGuideCard
 * Shown under the empty Published state: three plain-text steps guiding the user
 * from creating a draft through confirming URL to publishing.
 * Typography matches `PublishedEmptyState` (`text-xs`, `leading-relaxed`).
 * Figma: Trust Center Vision HQ > Designer > Published > Publish guide (May 2026)
 * Title typography matches `PublishedEmptyState` title: `text-xs font-medium leading-snug text-primary-800`.
 */
export default function PublishedPublishGuideCard({
  isPublishDisabled,
  onPublishNow,
  onGoToDraftTab,
}: PublishedPublishGuideCardProps) {
  const url = 'trust.mediacore.com';

  return (
    <div className="px-5 py-4">
      <h2 className="text-xs font-medium leading-snug text-primary-800">Publish your Trust Center</h2>

      <div className="my-3 border-t border-primary-300" role="presentation" aria-hidden />

      <ol className="list-none space-y-4 p-0">
        {/* Step 1 */}
        <li className="text-xs leading-relaxed text-primary-600">
          <span className="font-medium text-primary-800">Step 1: </span>
          Create a draft of your Trust Center by visiting the{' '}
          <button
            type="button"
            onClick={onGoToDraftTab}
            className="font-medium text-link-400 underline underline-offset-2 hover:text-link-400/80"
          >
            Draft tab
          </button>
          .
        </li>

        {/* Step 2 */}
        <li className="text-xs leading-relaxed text-primary-600">
          <span className="font-medium text-primary-800">Step 2: </span>
          Confirm your branded url:{' '}
          <span className="font-medium text-primary-800">{url}</span>
          . Need help making a custom domain?{' '}
          <a
            href="#"
            className="font-medium text-link-400 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Contact Support
          </a>
          .
        </li>

        {/* Step 3 */}
        <li className="text-xs leading-relaxed text-primary-600">
          <span className="font-medium text-primary-800">Step 3: </span>
          Publish your draft.
        </li>
      </ol>

      {/* Border + radius match staging **Preview As…** control (`border-primary-300`, `rounded-lg`, `shadow-sm`). */}
      <button
        type="button"
        disabled={isPublishDisabled}
        onClick={onPublishNow}
        aria-label={isPublishDisabled ? 'Publish draft now unavailable until you have a draft' : 'Publish Draft Now'}
        className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-primary-300 bg-white px-3 py-2 text-xs font-medium text-primary-800 shadow-sm transition-colors hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        title={isPublishDisabled ? 'Create a draft on the Draft tab first' : undefined}
      >
        Publish Draft Now
      </button>
    </div>
  );
}
