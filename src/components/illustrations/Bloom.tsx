import type { CSSProperties } from 'react';

/**
 * A five-petal flower, drawn as five circles around a centre. Shared by the
 * illustrations so every bloom matches. Petal colour is a light tile tint
 * (lilac, butter, peach, mist or sea: never pink or red, red is only for Help).
 * Pass `className="grow-leaf"` to have it unfurl once with the other growing
 * parts; it turns around its own centre.
 */
interface BloomProps {
  cx: number;
  cy: number;
  /** Overall radius, in the illustration's 112-unit space. */
  r: number;
  petal?: 'tile-lilac' | 'tile-butter' | 'tile-peach' | 'tile-mist' | 'tile-sea';
  center?: 'tile-butter' | 'tile-peach' | 'tile-keylime';
  /** Outline width; use 2 for large blooms and about 1.6 for small ones. */
  strokeWidth?: number;
  className?: string;
}

export function Bloom({ cx, cy, r, petal = 'tile-lilac', center = 'tile-butter', strokeWidth = 2, className }: BloomProps) {
  const pr = r * 0.4;
  const dist = r * 0.6;
  const style: CSSProperties = { transformOrigin: `${cx}px ${cy}px`, transformBox: 'view-box' };
  return (
    <g className={className} style={style}>
      <g fill={`var(--color-${petal})`} stroke="var(--color-forest)" strokeWidth={strokeWidth} strokeLinejoin="round">
        {[0, 1, 2, 3, 4].map((i) => {
          const a = ((-90 + i * 72) * Math.PI) / 180;
          return <circle key={i} cx={+(cx + dist * Math.cos(a)).toFixed(2)} cy={+(cy + dist * Math.sin(a)).toFixed(2)} r={pr} />;
        })}
      </g>
      <circle cx={cx} cy={cy} r={r * 0.3} fill={`var(--color-${center})`} stroke="var(--color-forest)" strokeWidth={strokeWidth} />
    </g>
  );
}
