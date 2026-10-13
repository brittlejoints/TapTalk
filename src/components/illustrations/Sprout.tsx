import { MARK_STROKE, MarkPaths } from '../LogoMark';

/**
 * A sprout growing out of the Tap Talk app icon: words growing into a voice.
 * It grows in once on the welcome screen (only with playful touches on), then stays still.
 */
export function SproutIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Stem and leaves, behind the bubble */}
      <path className="grow-stem" d="M56 54V22" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <path
        className="grow-leaf left"
        d="M55 38c-12 1-21-5-23-15 11-2 21 3 23 15Z"
        fill="var(--color-sage)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        className="grow-leaf right"
        d="M57 30c3-11 12-17 24-15-1 11-11 17-24 15Z"
        fill="var(--color-tile-butter)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
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
