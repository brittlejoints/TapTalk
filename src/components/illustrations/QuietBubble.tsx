/** A calm speech bubble with a flat line and a small leaf. Shown when the browser can't speak out loud. */
export function QuietBubbleIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      <path className="grow-stem" d="M56 38V26" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <path
        className="grow-leaf right"
        d="M57 30c2-9 10-14 20-13-1 10-10 15-20 13Z"
        fill="var(--color-sage)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M30 38h52a14 14 0 0 1 14 14v22a14 14 0 0 1-14 14H52L36 99V88h-6a14 14 0 0 1-14-14V52a14 14 0 0 1 14-14Z"
        fill="var(--color-tile-mist)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M40 63h32" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
