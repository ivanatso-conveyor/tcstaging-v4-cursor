/**
 * PublishLiveSuccessToast
 * Short-lived top toast after the user confirms **Publish Live URL** in `PublishConfirmModal`.
 * Shows title + subtitle, decorative confetti burst, and a bottom progress bar that shrinks
 * from right to left over the toast lifetime (same duration as the fade in/out wrapper).
 *
 * Figma: Trust Center Vision HQ > Designer > Publish success feedback (May 2026)
 */

import { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DESIGNER_FEEDBACK_TOAST_DURATION_MS } from '../../constants/designerFeedbackToast';

/** @deprecated Prefer `DESIGNER_FEEDBACK_TOAST_DURATION_MS` from `constants/designerFeedbackToast`. */
export const PUBLISH_LIVE_SUCCESS_TOAST_DURATION_MS = DESIGNER_FEEDBACK_TOAST_DURATION_MS;

const CONFETTI_COUNT = 32;

type ConfettiPiece = {
  dx: number;
  dy: number;
  rotDeg: number;
  delayMs: number;
  durationMs: number;
  colorVar: string;
  wide: boolean;
};

function buildConfettiPieces(seed: number): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];
  const colorVars = [
    'var(--color-brand-400)',
    'var(--color-brand-200)',
    'var(--color-link-400)',
    'var(--color-purple-300)',
    'var(--color-primary-100)',
  ];
  let rnd = seed;
  const next = () => {
    rnd = (rnd * 1103515245 + 12345) >>> 0;
    return rnd / 0xffffffff;
  };
  for (let i = 0; i < CONFETTI_COUNT; i += 1) {
    const angle = (Math.PI * 2 * i) / CONFETTI_COUNT + next() * 0.55;
    const dist = 64 + next() * 92;
    pieces.push({
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 18 * next(),
      rotDeg: (next() - 0.5) * 540,
      delayMs: Math.floor(next() * 100),
      durationMs: 720 + Math.floor(next() * 420),
      colorVar: colorVars[i % colorVars.length]!,
      wide: next() > 0.45,
    });
  }
  return pieces;
}

export function PublishLiveSuccessToast({ visible }: { visible: boolean }) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [confettiBurstKey, setConfettiBurstKey] = useState(0);
  const burstSeedRef = useRef(0);

  useLayoutEffect(() => {
    if (visible) {
      burstSeedRef.current += 1;
      setConfettiPieces(buildConfettiPieces(burstSeedRef.current));
      setConfettiBurstKey((k) => k + 1);
    } else {
      setConfettiPieces([]);
    }
  }, [visible]);

  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{ animation: `fadeInOut ${DESIGNER_FEEDBACK_TOAST_DURATION_MS}ms ease-out forwards` }}
      className="pointer-events-none fixed left-1/2 top-16 z-[300]"
    >
      <div className="relative inline-block max-w-sm">
        <div
          className="publish-live-success-confetti pointer-events-none absolute left-1/2 top-[42%] z-0 h-44 w-[120%] min-w-[280px] -translate-x-1/2 -translate-y-1/2"
          aria-hidden
        >
          {confettiPieces.map((p, i) => (
            <span
              key={`${confettiBurstKey}-confetti-${i}`}
              className="publish-live-success-confetti-piece absolute left-1/2 top-1/2 block rounded-[1px]"
              style={{
                width: p.wide ? 7 : 4,
                height: p.wide ? 4 : 9,
                backgroundColor: p.colorVar,
                ['--confetti-dx' as string]: `${p.dx}px`,
                ['--confetti-dy' as string]: `${p.dy}px`,
                ['--confetti-rot' as string]: `${p.rotDeg}deg`,
                animationDuration: `${p.durationMs}ms`,
                animationDelay: `${p.delayMs}ms`,
              }}
            />
          ))}
        </div>

        <div className="pointer-events-auto relative z-10 overflow-hidden rounded-lg bg-primary-900 shadow-lg">
          <div className="px-4 py-3 text-left">
            <p className="text-sm font-semibold text-white">Successfully Published</p>
            <p className="mt-1 text-xs font-normal leading-relaxed text-white/90">Your Trust Center is now live</p>
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
