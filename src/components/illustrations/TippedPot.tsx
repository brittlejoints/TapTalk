/**
 * A gently tipped-over flower pot — for the error screen. Says "something fell,
 * but it's not broken." Softer than a bare error message, without being cute
 * about the failure.
 */
export function TippedPotIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Soft shadow suggesting ground */}
      <ellipse cx="56" cy="97" rx="44" ry="4" fill="var(--color-tile-sand)" opacity="0.9" />
      {/* The pot is tipped ~22 degrees to the right: body, rim band and highlight */}
      <g transform="rotate(22 56 86)">
        <path
          d="M36 72h40l-4 17a4 4 0 0 1-4 3h-24a4 4 0 0 1-4-3Z"
          fill="var(--color-tile-peach)"
          stroke="var(--color-forest)"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path d="M42 78l2.5 10" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
        <path d="M54 83h.1M62 83h.1M70 83h.1" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
        <rect x="31" y="63" width="50" height="9" rx="3.5" fill="var(--color-tile-peach)" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M38 67.5h10" stroke="var(--color-cream)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      </g>
      {/* Soil that spilled out, and a leaf that came with it */}
      <path d="M76 97c2-7 11-9 17-6 3 1 6 3 8 6Z" fill="var(--color-forest)" opacity="0.45" />
      <circle cx="82" cy="86" r="2" fill="var(--color-forest)" opacity="0.5" />
      <circle cx="89" cy="87" r="1.5" fill="var(--color-forest)" opacity="0.4" />
      <circle cx="94" cy="84" r="1.2" fill="var(--color-forest)" opacity="0.3" />
      <path d="M97 99c3-3 8-3 11-1-2 3-8 4-11 1Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M98.5 99C101 98 104 97.8 106.5 98" {...vein} />
      {/* A pebble */}
      <ellipse cx="20" cy="97" rx="3.5" ry="2.5" fill="var(--color-tile-sand)" stroke="var(--color-forest)" strokeWidth="1.5" />
      {/* Sprout sitting next to the pot, still fine */}
      <g transform="translate(0 -2)">
        <path d="M26 92V74" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M25 80c-6 0-10-3-11-9 6-1 10 2 11 9Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M23.5 78.5C19 77 16 74.5 15 72.5" {...vein} />
        <path d="M27 76c1-6 6-9 12-8-1 6-6 9-12 8Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M28.5 74.5C31.5 72 34.5 70.5 37 69.5" {...vein} />
      </g>
    </svg>
  );
}
