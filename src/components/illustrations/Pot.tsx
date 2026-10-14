import { Bloom } from './Bloom';

/**
 * A seedling in a pot, with a first flower at the tip. Shown on the empty Saved page.
 * Reuses the sprout's `.grow-stem` and `.grow-leaf` animations so it grows
 * in once when the user lands on an empty Saved tab.
 * Detail lines (veins, bands) are 1.5 units at half strength so they stay
 * readable at the 80px this is drawn at.
 */
export function PotIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Ground: a soft shadow, two pebbles and little grass tufts */}
      <ellipse cx="56" cy="100" rx="38" ry="4" fill="var(--color-tile-sand)" />
      <ellipse cx="94" cy="98" rx="3.5" ry="2.5" fill="var(--color-tile-sand)" stroke="var(--color-forest)" strokeWidth="1.5" />
      <ellipse cx="20" cy="99" rx="2.5" ry="1.8" fill="var(--color-tile-sand)" stroke="var(--color-forest)" strokeWidth="1.5" />
      <path d="M88 98c0-4 1-6 2-8M91 98c1-3 3-5 5-6" {...vein} />
      {/* Pot body, with a cream highlight and a row of dots */}
      <path
        d="M36 76h40l-4.5 20a4 4 0 0 1-4 3h-23a4 4 0 0 1-4-3Z"
        fill="var(--color-tile-peach)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M42 82l3 12" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <path d="M52 88h.1M60 88h.1M68 88h.1" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" opacity="0.45" />
      {/* Soil mound, then the rim over it */}
      <path d="M38 69c6-6 30-6 36 0Z" fill="var(--color-forest)" opacity="0.55" />
      <rect x="31" y="68" width="50" height="9" rx="3.5" fill="var(--color-tile-peach)" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M38 72.5h10" stroke="var(--color-cream)" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      {/* Stem */}
      <path className="grow-stem" d="M56 68V40" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      {/* Left leaf, with its midrib */}
      <g className="grow-leaf left">
        <path d="M55 60c-10 0-17-5-18-14 10-1 17 4 18 14Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M53.5 58.5C47 56 42 52 39.5 48.5" {...vein} />
      </g>
      {/* Right leaf, with its midrib */}
      <g className="grow-leaf right">
        <path d="M57 54c2-9 10-14 20-13-1 10-10 15-20 13Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M58.5 52.5C64 48 70 44.5 75 43" {...vein} />
      </g>
      {/* The first flower, opening at the tip */}
      <Bloom className="grow-leaf" cx={56} cy={33} r={13} petal="tile-lilac" center="tile-butter" strokeWidth={2} />
      {/* Sparkle */}
      <path className="sparkle" d="M90 30l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="var(--color-forest)" opacity="0.7" />
    </svg>
  );
}
