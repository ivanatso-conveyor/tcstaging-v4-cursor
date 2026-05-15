/**
 * UnpublishTrustCenterToast
 * Top toast after the user confirms **Unpublish Trust Center** in the Published tab modal.
 * Matches the publish success toast shell (dark card, bottom progress countdown), without confetti.
 *
 * Figma: Trust Center Vision HQ > Designer > Publish success feedback (May 2026), neutral variant
 */

import { createPortal } from 'react-dom';
import { DESIGNER_FEEDBACK_TOAST_DURATION_MS } from '../../constants/designerFeedbackToast';

type UnpublishTrustCenterToastProps = {
  visible: boolean;
  /** Draft name shown in the subtitle (matches the draft row after unpublish). */
  draftName: string;
};

export function UnpublishTrustCenterToast({ visible, draftName }: UnpublishTrustCenterToastProps) {
  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{ animation: `fadeInOut ${DESIGNER_FEEDBACK_TOAST_DURATION_MS}ms ease-out forwards` }}
      className="pointer-events-none fixed left-1/2 top-16 z-[300]"
    >
      <div className="relative inline-block max-w-sm">
        <div className="pointer-events-auto relative z-10 overflow-hidden rounded-lg bg-primary-900 shadow-lg">
          <div className="px-4 py-3 text-left">
            <p className="text-sm font-semibold text-white">Trust Center unpublished</p>
            <p className="mt-1 text-xs font-normal leading-relaxed text-white/90">
              <span className="font-medium text-white">{draftName}</span> is your new draft
            </p>
          </div>
          <div className="h-1 w-full bg-primary-800" aria-hidden>
            <div
              className="publish-live-success-toast-progress-fill h-full w-full bg-brand-400"
              style={{ animationDuration: `${DESIGNER_FEEDBACK_TOAST_DURATION_MS}ms` }}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
