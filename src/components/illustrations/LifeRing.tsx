/**
 * A life ring in peach and cream (never red: red is only for the Help button and screen).
 * Shown on the onboarding step about Help.
 */
export function LifeRingIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Ring body: peach with four cream bands */}
      <circle cx="56" cy="56" r="26" stroke="var(--color-tile-peach)" strokeWidth="20" />
      <circle cx="56" cy="56" r="26" stroke="var(--color-cream)" strokeWidth="20" strokeDasharray="20.4 40.8" transform="rotate(-45 56 56)" />
      {/* Outlines */}
      <circle cx="56" cy="56" r="36" stroke="var(--color-forest)" strokeWidth="2.5" />
      <circle cx="56" cy="56" r="16" stroke="var(--color-forest)" strokeWidth="2.5" />
      {/* A sprout poking up beside it: help that grows with you */}
      <path className="grow-stem" d="M94 96V80" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <path className="grow-leaf left" d="M93 88c-7 0-11-3-12-9 7-1 11 2 12 9Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      <path className="grow-leaf right" d="M95 84c1-6 6-9 12-8-1 6-6 9-12 8Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      <path className="sparkle" d="M20 22l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="var(--color-forest)" opacity="0.7" />
    </svg>
  );
}
