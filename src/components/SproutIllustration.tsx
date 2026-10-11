/**
 * A sprout growing out of a speech bubble: words growing into a voice.
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
      {/* Speech bubble with sound bars */}
      <path
        d="M30 52h52a14 14 0 0 1 14 14v18a14 14 0 0 1-14 14H52l-16 11V98h-6a14 14 0 0 1-14-14V66a14 14 0 0 1 14-14Z"
        fill="var(--color-cream)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <g fill="var(--color-forest)">
        <rect x="42" y="68" width="5" height="14" rx="2.5" />
        <rect x="53.5" y="63" width="5" height="24" rx="2.5" />
        <rect x="65" y="70" width="5" height="10" rx="2.5" />
      </g>
      {/* Sparkles */}
      <path className="sparkle" d="M92 22l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="var(--color-forest)" />
      <path className="sparkle" d="M22 40l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2 1.2-3Z" fill="var(--color-forest)" opacity="0.6" />
    </svg>
  );
}
