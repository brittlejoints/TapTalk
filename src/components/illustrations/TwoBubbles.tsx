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
      {/* A line of words in each bubble, a little sprout on the one that's listening */}
      <g stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" opacity="0.4">
        <path d="M27 45h12M27 54h8" />
        <path d="M76 45h16M80 54h12" />
      </g>
      <path d="M33 34V28" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M32.5 30c-4 0-6-2-7-5 4-1 6 1 7 5Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M34 29c1-4 4-5 7-4-1 4-4 5-7 4Z" fill="var(--color-tile-keylime)" stroke="var(--color-forest)" strokeWidth="1.8" strokeLinejoin="round" />
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
