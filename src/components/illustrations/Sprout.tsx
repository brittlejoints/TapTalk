import { MARK_STROKE, MarkPaths } from '../LogoMark';

/**
 * A sprout growing out of the Tap Talk app icon: words growing into a voice.
 * It grows in once on the welcome screen (only with playful touches on), then stays still.
 */
export function SproutIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* A soft shadow under the icon */}
      <ellipse cx="56" cy="108.5" rx="30" ry="2.5" fill="var(--color-tile-sand)" />
      {/* Stem and leaves, behind the bubble */}
      <path className="grow-stem" d="M56 54V22" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <g className="grow-leaf left">
        <path d="M55 38c-12 1-21-5-23-15 11-2 21 3 23 15Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M53 36C46 34 38 30 34.5 25" {...vein} />
      </g>
      <g className="grow-leaf right">
        <path d="M57 30c3-11 12-17 24-15-1 11-11 17-24 15Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M59 28C65 22 72 18 79 16.5" {...vein} />
        {/* A dewdrop on the leaf */}
        <path d="M70 30c0 3-2 5-2 5s-2-2-2-5a2 2 0 0 1 4 0Z" fill="var(--color-tile-sea)" stroke="var(--color-forest)" strokeWidth="1.5" strokeLinejoin="round" />
      </g>
      {/* The app icon: the mark, scaled into a forest tile */}
      <rect x="28" y="52" width="56" height="56" rx="14" fill="var(--color-forest)" />
      <g
        transform="translate(27.2 48.9) scale(0.117)"
        fill="none"
        stroke="var(--color-keylime)"
        strokeWidth={MARK_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <MarkPaths />
      </g>
      {/* Sparkles */}
      <path className="sparkle" d="M92 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="var(--color-forest)" />
      <path className="sparkle" d="M22 40l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" fill="var(--color-forest)" opacity="0.6" />
    </svg>
  );
}
