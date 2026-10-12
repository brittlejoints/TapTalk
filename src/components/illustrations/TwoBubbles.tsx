/**
 * Two speech bubbles with a heart floating between them. Shown on the Help
 * screen when no emergency contacts are set up yet — "add someone who can
 * answer when you need them."
 */
export function TwoBubblesIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Left bubble */}
      <path
        className="grow-leaf left"
        style={{ transformOrigin: '28px 56px' }}
        d="M14 46a12 12 0 0 1 12-12h18a12 12 0 0 1 12 12v12a12 12 0 0 1-12 12H30l-10 8v-8h-6a12 12 0 0 1-12-12V46Z"
        transform="translate(6 0)"
        fill="var(--color-tile-mint)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Right bubble */}
      <path
        className="grow-leaf right"
        style={{ transformOrigin: '84px 56px' }}
        d="M60 46a12 12 0 0 1 12-12h18a12 12 0 0 1 12 12v12a12 12 0 0 1-12 12h-6v8l-10-8H72a12 12 0 0 1-12-12V46Z"
        fill="var(--color-tile-butter)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Heart in the middle */}
      <path
        className="sparkle"
        style={{ transformOrigin: '56px 54px' }}
        d="M56 64c-6-4-11-8-11-13a5 5 0 0 1 11-3 5 5 0 0 1 11 3c0 5-5 9-11 13Z"
        fill="var(--color-help-wash)"
        stroke="var(--color-help-ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
