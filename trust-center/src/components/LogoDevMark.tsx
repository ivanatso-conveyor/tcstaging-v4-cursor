import { useMemo, useState, type CSSProperties } from 'react';
import { getLogoDevImageSrc } from '../lib/logoDev';

type LogoDevMarkProps = {
  /** Registered domain, e.g. `stripe.com` */
  domain: string;
  /** Company or product label — used for fallback initial and optional alt text */
  brandName: string;
  /** CSS box size in pixels */
  sizePx: number;
  className?: string;
  /** Classes for the letter fallback (when no token, bad domain, or image error) */
  fallbackClassName?: string;
  fallbackStyle?: CSSProperties;
  /** If set, used as img alt; otherwise `brandName` is used when showing the image */
  alt?: string;
};

export default function LogoDevMark({
  domain,
  brandName,
  sizePx,
  className = '',
  fallbackClassName = '',
  fallbackStyle,
  alt,
}: LogoDevMarkProps) {
  const src = useMemo(
    () => getLogoDevImageSrc(domain, { size: Math.min(512, Math.max(64, sizePx * 2)) }),
    [domain, sizePx],
  );
  const [failed, setFailed] = useState(false);
  const initial = (brandName.trim()[0] ?? '?').toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center font-medium ${fallbackClassName}`}
        style={{ width: sizePx, height: sizePx, fontSize: Math.max(10, sizePx * 0.38), ...fallbackStyle }}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt !== undefined ? alt : `${brandName} logo`}
      width={sizePx}
      height={sizePx}
      className={`shrink-0 object-contain ${className}`}
      loading="lazy"
      decoding="async"
      referrerPolicy="origin"
      onError={() => setFailed(true)}
    />
  );
}
