/** A calm speech bubble with a flat line and a small leaf. Shown when the browser can't speak out loud. */
export function QuietBubbleIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      <path className="grow-stem" d="M56 38V26" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <g className="grow-leaf left">
        <path d="M55 33c-8 0-14-3-15-10 8-1 14 3 15 10Z" fill="var(--color-tile-keylime)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M53.5 31.5C48.5 30 45 27.5 42.5 24.5" {...vein} />
      </g>
      <g className="grow-leaf right">
        <path d="M57 30c2-9 10-14 20-13-1 10-10 15-20 13Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M58.5 28.5C64 24 70 20.5 75 19" {...vein} />
      </g>
      <path
        d="M30 38h52a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H52L36 99V88h-6a14 14 0 0 1-14-14V52a14 14 0 0 1 14-14Z"
        fill="var(--color-tile-mist)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* A highlight on the bubble, and a calm flat line with a dot at each end */}
      <path d="M26 54a6 6 0 0 1 6-6h10" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      <path d="M40 63h32" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <path d="M32 63h.1M80 63h.1" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
