/**
 * A watering can giving a seedling a drink. Shown for app updates and "ready offline": fresh and looked after.
 * Detail lines are 1.5 units at half strength so they read at 80px.
 */
export function WateringCanIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  const drop = { fill: 'var(--color-tile-sea)', stroke: 'var(--color-forest)', strokeWidth: 2, strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Ground, with the seedling being watered */}
      <ellipse cx="60" cy="103" rx="46" ry="4" fill="var(--color-tile-sand)" />
      <path d="M97 102V92" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M96 97c-5 0-8-2-9-6 5-1 8 1 9 6Z" fill="var(--color-tile-keylime)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M98 94c1-5 5-7 9-6-1 5-5 7-9 6Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      {/* Handle */}
      <path d="M31 54c-14 0-17 6-17 14s3 14 17 14" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      {/* Spout, with a rose on the end */}
      <path d="M72 58 92 43l5 6-22 18" fill="var(--color-tile-mint)" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinejoin="round" />
      <ellipse cx="95.5" cy="44" rx="4.5" ry="9.5" transform="rotate(-36 95.5 44)" fill="var(--color-tile-sea)" stroke="var(--color-forest)" strokeWidth="2.5" />
      {/* Body, with a band and a highlight */}
      <path
        d="M30 46h44l-3 40a6 6 0 0 1-6 5H39a6 6 0 0 1-6-5Z"
        fill="var(--color-tile-sea)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M31.5 60h41" {...vein} />
      <path d="M39 68l1.5 16" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      {/* Lid */}
      <path d="M36 46c4-9 34-9 38 0" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52 40.5a3 3 0 0 1 6 0" {...vein} />
      {/* Water falling from the rose onto the seedling */}
      <path d="M101 60c0 4-3 7-3 7s-3-3-3-7a3 3 0 0 1 6 0Z" {...drop} />
      <path d="M96 73c0 3-2.5 5.5-2.5 5.5S91 76 91 73a2.5 2.5 0 0 1 5 0Z" {...drop} strokeWidth={1.8} />
      <path d="M105 72h.1M103 80h.1" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      <path className="sparkle" d="M20 82l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="var(--color-forest)" opacity="0.7" />
    </svg>
  );
}
