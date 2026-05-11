/**
 * ShareViaInviteModal
 * Static prototype for inviting contacts to view the Trust Center.
 * Two tabs: Direct Invitation (email-based) and Share via Link (public URL with copy).
 * Entry point: RightPanel Published tab > active row "..." menu > "Share via invite".
 *
 * Prototype only: no persistence, no API calls, no backend wiring.
 */
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Info, X } from 'lucide-react';
import TrustCenterModalBackdrop from './TrustCenterModalBackdrop';

type Props = { onClose: () => void };

const EXPIRATION_OPTIONS = ['30 days', '60 days', '90 days', '180 days', '1 year', 'Never'];
const PRELAUNCH_URL = 'https://pr-3348.preview.chq';

export default function ShareViaInviteModal({ onClose }: Props) {
  const [tab, setTab] = useState<'direct' | 'link'>('direct');
  const [emails, setEmails] = useState('');
  const [expiration, setExpiration] = useState('90 days');
  const [bypassNda, setBypassNda] = useState(false);
  const [groupMode, setGroupMode] = useState<'none' | 'groups'>('none');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const emailCount = useMemo(
    () =>
      emails
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter(Boolean).length,
    [emails],
  );

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(PRELAUNCH_URL).catch(() => {});
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[200]">
      <TrustCenterModalBackdrop onClose={onClose} />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="share-via-invite-title"
          className="pointer-events-auto flex h-[min(760px,92vh)] max-h-[min(760px,92vh)] w-full max-w-[640px] flex-col overflow-hidden rounded-lg shadow-[0px_10px_20px_0px_rgba(0,0,0,0.1),0px_0px_3px_0px_rgba(0,0,0,0.1)]"
        >
          <header className="flex h-14 shrink-0 items-center gap-5 rounded-t-lg bg-primary-100 pl-6 pr-2 shadow-[inset_0px_-1px_0px_0px_var(--color-primary-400)]">
            <h2
              id="share-via-invite-title"
              className="min-w-0 flex-1 text-xl font-medium leading-[1.35] text-primary-800"
            >
              Share
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded text-primary-700 hover:bg-primary-100"
              aria-label="Close"
            >
              <X size={16} strokeWidth={2} aria-hidden />
            </button>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-white">
            <div className="flex gap-6 border-b border-primary-200 px-6" role="tablist" aria-label="Share method">
              <TabButton active={tab === 'direct'} onClick={() => setTab('direct')}>
                Direct Invitation
              </TabButton>
              <TabButton active={tab === 'link'} onClick={() => setTab('link')}>
                Share via Link
              </TabButton>
            </div>

            {tab === 'direct' ? (
              <div className="space-y-6 px-6 py-5">
                <div>
                  <label htmlFor="share-emails" className="block text-sm font-semibold text-primary-800">
                    Contact Email Addresses<span className="text-red-500">*</span>
                  </label>
                  <p className="mt-1 text-xs leading-relaxed text-primary-600">
                    Enter or paste a comma or newline-separated list of emails to invite in the input below.
                    When they interact with your content, you'll see their activity grouped by domain in your Connections.
                  </p>
                  <textarea
                    id="share-emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    placeholder="email@email.com"
                    className="mt-2 block min-h-[100px] w-full resize-y rounded-md border border-link-400 bg-white px-3 py-2 text-sm text-primary-800 placeholder:text-primary-400 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                  />
                  <p className="mt-1.5 flex items-center gap-1.5 text-xs text-primary-600">
                    <Info size={12} strokeWidth={2} aria-hidden />
                    {emailCount === 0
                      ? 'No email addresses entered.'
                      : `${emailCount} email address${emailCount === 1 ? '' : 'es'} entered.`}
                  </p>
                </div>

                <div>
                  <label htmlFor="share-expiration" className="block text-sm font-semibold text-primary-800">
                    Approval Expiration
                  </label>
                  <select
                    id="share-expiration"
                    value={expiration}
                    onChange={(e) => setExpiration(e.target.value)}
                    className="mt-2 block w-full rounded-md border border-primary-400 bg-white px-3 py-2 text-sm text-primary-800 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400"
                  >
                    {EXPIRATION_OPTIONS.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="block text-sm font-semibold text-primary-800">Bypass NDA</p>
                  <label className="mt-2 flex cursor-pointer items-start gap-2">
                    <input
                      type="checkbox"
                      checked={bypassNda}
                      onChange={(e) => setBypassNda(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-primary-400 text-link-400 focus:ring-link-400"
                    />
                    <span className="text-sm leading-relaxed text-primary-800">
                      This user already has an NDA in place covering access of protected trust center content.
                    </span>
                  </label>
                </div>

                <div>
                  <p className="block text-sm font-semibold text-primary-800">Group Memberships</p>
                  <p className="mt-1 text-xs leading-relaxed text-primary-600">
                    Used to authorize contacts to be able to view or download any need to know documents.
                  </p>
                  <div className="mt-3 space-y-2">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="group-mode"
                        checked={groupMode === 'none'}
                        onChange={() => setGroupMode('none')}
                        className="h-4 w-4 border-primary-400 text-link-400 focus:ring-link-400"
                      />
                      <span className="text-sm text-primary-800">None</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="radio"
                        name="group-mode"
                        checked={groupMode === 'groups'}
                        onChange={() => setGroupMode('groups')}
                        className="h-4 w-4 border-primary-400 text-link-400 focus:ring-link-400"
                      />
                      <span className="text-sm text-primary-800">Add them to the following access groups:</span>
                    </label>
                    <select
                      disabled={groupMode !== 'groups'}
                      className="block w-full rounded-md border border-primary-400 bg-white px-3 py-2 text-sm text-primary-800 focus:border-link-400 focus:outline-none focus:ring-1 focus:ring-link-400 disabled:cursor-not-allowed disabled:opacity-50"
                      defaultValue=""
                    >
                      <option value="">Choose access groups or start typing to create</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 px-6 py-5">
                <div className="flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs leading-snug text-amber-900">
                  <Info size={14} strokeWidth={2} className="mt-0.5 shrink-0 text-amber-700" aria-hidden />
                  <span>
                    Anyone with this link can view the Trust Center. Use Direct Invitation when you need
                    per-contact tracking, NDA enforcement, or group-based document access.
                  </span>
                </div>
                <div>
                  <p className="block text-sm font-semibold text-primary-800">Pre-launch link</p>
                  <div className="mt-2 flex items-center gap-2 rounded-md border border-primary-400 bg-primary-100 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-primary-800">{PRELAUNCH_URL}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="inline-flex items-center gap-1.5 rounded border border-primary-400 bg-white px-2 py-1 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
                      aria-label="Copy pre-launch link"
                    >
                      <Copy size={12} strokeWidth={2} aria-hidden />
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <footer className="flex h-[72px] shrink-0 items-center justify-end gap-2 rounded-b-lg bg-primary-200 px-6 shadow-[0px_-1px_0px_0px_var(--color-primary-400)]">
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 items-center justify-center rounded-[3px] border border-primary-400 bg-white px-5 text-sm font-medium text-primary-700 shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-primary-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={tab === 'direct' && emailCount === 0}
              className="flex h-10 items-center justify-center rounded-[3px] bg-brand-400 px-5 text-sm font-medium text-white shadow-[0px_2px_5px_0px_rgba(0,0,0,0.1)] hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tab === 'direct' ? 'Send Invitations' : 'Done'}
            </button>
          </footer>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`relative -mb-px px-1 py-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-primary-800/25 ${
        active ? 'text-primary-800' : 'text-primary-500 hover:text-primary-700'
      }`}
    >
      {children}
      {active ? <span className="absolute inset-x-0 bottom-0 h-[2px] bg-brand-400" aria-hidden /> : null}
    </button>
  );
}
