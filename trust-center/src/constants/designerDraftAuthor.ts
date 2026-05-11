/** Prototype: session user shown on draft labels until real auth is wired. */
export const DESIGNER_DRAFT_EDITOR_DISPLAY_NAME = 'You';

/** Prototype cap on concurrent drafts (staging panel + create flow). */
export const MAX_DESIGNER_DRAFTS = 1;

/** e.g. `Draft 04/09/26 at 3:45 PM` (local time). */
export function formatDraftLabel(updatedAt: number): string {
  const d = new Date(updatedAt);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yy = String(d.getFullYear()).slice(-2);
  const time = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(d);
  return `Trust Center ${mm}/${dd}/${yy} at ${time}`;
}

/** e.g. `Trust Center 4-13-26` (short date, no zero-padding on month/day). */
export function formatTrustCenterName(): string {
  const d = new Date();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  const yy = String(d.getFullYear()).slice(-2);
  return `Trust Center ${m}-${day}-${yy}`;
}
