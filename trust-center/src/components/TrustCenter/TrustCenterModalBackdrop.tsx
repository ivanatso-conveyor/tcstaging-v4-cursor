/**
 * Full-viewport scrim: #001B28 @ 25% + blur (Trust Center modals).
 * Fades in via `tc-modal-backdrop-enter` (see index.css) so the modal
 * resolves smoothly after the right-panel scroll instead of popping.
 */
export default function TrustCenterModalBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <button
      type="button"
      className="tc-modal-backdrop-enter absolute inset-0 backdrop-blur-[6px]"
      style={{ backgroundColor: 'rgba(0, 27, 40, 0.25)' }}
      onClick={onClose}
      aria-label="Close dialog"
    />
  );
}
