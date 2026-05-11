/** Ligature text for Google Material Symbols Rounded (e.g. `language`, `shield`). */
export type MaterialSymbol = string;

/** Renders a Google Material Symbols Rounded icon. */
export default function MaterialIcon({
  symbol,
  size = 16,
  className = '',
  color,
  filled = false,
}: {
  symbol: MaterialSymbol;
  size?: number;
  className?: string;
  color?: string;
  filled?: boolean;
}) {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontSize: size,
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 20`,
        lineHeight: 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
      }}
    >
      {symbol}
    </span>
  );
}
