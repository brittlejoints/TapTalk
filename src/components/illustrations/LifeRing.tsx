/**
 * A life ring in peach and cream (never red: red is only for the Help button and screen).
 * Shown on the onboarding step about Help.
 */
export function LifeRingIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Water under the ring */}
      <path d="M8 102q7-5 14 0t14 0 14 0 14 0 14 0" stroke="var(--color-tile-sea)" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 109q6-4 12 0t12 0 12 0" stroke="var(--color-tile-mist)" strokeWidth="3" strokeLinecap="round" />
      {/* Ring body: peach with four cream bands */}
      <circle cx="56" cy="56" r="26" stroke="var(--color-tile-peach)" strokeWidth="20" />
      <circle cx="56" cy="56" r="26" stroke="var(--color-cream)" strokeWidth="20" strokeDasharray="20.4 40.8" transform="rotate(-45 56 56)" />
      {/* Outlines */}
      <circle cx="56" cy="56" r="36" stroke="var(--color-forest)" strokeWidth="2.5" />
      <circle cx="56" cy="56" r="16" stroke="var(--color-forest)" strokeWidth="2.5" />
      {/* A highlight on the ring's upper left */}
      <path d="M32 44a28 28 0 0 1 12-12" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      {/* A sprout poking up beside it: help that grows with you */}
      <path className="grow-stem" d="M94 96V80" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <g className="grow-leaf left"><path d="M93 88c-7 0-11-3-12-9 7-1 11 2 12 9Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" /><path d="M91.5 86.5C87 85 84 82.5 82.5 80.5" {...vein} /></g>
      <g className="grow-leaf right"><path d="M95 84c1-6 6-9 12-8-1 6-6 9-12 8Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" /><path d="M96.5 82.5C99.5 80 102.5 78.5 105 77.5" {...vein} /></g>
      <path className="sparkle" d="M20 22l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="var(--color-forest)" opacity="0.7" />
    </svg>
  );
}
