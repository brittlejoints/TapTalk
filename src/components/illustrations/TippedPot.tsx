/**
 * A gently tipped-over flower pot — for the error screen. Says "something fell,
 * but it's not broken." Softer than a bare error message, without being cute
 * about the failure.
 */
export function TippedPotIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Soft shadow suggesting ground */}
      <ellipse cx="56" cy="96" rx="40" ry="4" fill="var(--color-tile-sand)" opacity="0.9" />
      {/* The pot is tipped ~22 degrees to the right */}
      <g transform="rotate(22 56 86)">
        <path
          d="M34 68h44l-5 20a4 4 0 0 1-4 3h-26a4 4 0 0 1-4-3Z"
          fill="var(--color-tile-peach)"
          stroke="var(--color-forest)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M32 68h48" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* A few bits of soil spilling out */}
      <circle cx="80" cy="88" r="2" fill="var(--color-forest)" opacity="0.5" />
      <circle cx="86" cy="92" r="1.5" fill="var(--color-forest)" opacity="0.4" />
      <circle cx="90" cy="88" r="1.2" fill="var(--color-forest)" opacity="0.3" />
      {/* Sprout sitting next to the pot, still fine */}
      <g transform="translate(0 -2)">
        <path d="M26 90V74" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
        <path
          d="M25 80c-6 0-10-3-11-9 6-1 10 2 11 9Z"
          fill="var(--color-sage)"
          stroke="var(--color-forest)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M27 76c1-6 6-9 12-8-1 6-6 9-12 8Z"
          fill="var(--color-tile-butter)"
          stroke="var(--color-forest)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
