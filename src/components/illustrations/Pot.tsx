/**
 * A seedling in a pot. Shown on the empty Saved page.
 * Reuses the sprout's `.grow-stem` and `.grow-leaf` animations so it grows
 * in once when the user lands on an empty Saved tab.
 */
export function PotIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Soft ground highlight */}
      <ellipse cx="56" cy="100" rx="32" ry="4" fill="var(--color-tile-sand)" />
      {/* Pot */}
      <path
        d="M34 72h44l-5 24a4 4 0 0 1-4 3h-26a4 4 0 0 1-4-3Z"
        fill="var(--color-tile-peach)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M32 72h48" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Soil line */}
      <path d="M38 78h36" stroke="var(--color-forest)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      {/* Stem */}
      <path className="grow-stem" d="M56 72V48" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      {/* Left leaf */}
      <path
        className="grow-leaf left"
        d="M55 60c-10 0-17-5-18-14 10-1 17 4 18 14Z"
        fill="var(--color-sage)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Right leaf */}
      <path
        className="grow-leaf right"
        d="M57 54c2-9 10-14 20-13-1 10-10 15-20 13Z"
        fill="var(--color-tile-butter)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Sparkle */}
      <path
        className="sparkle"
        d="M86 42l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"
        fill="var(--color-forest)"
        opacity="0.7"
      />
    </svg>
  );
}
