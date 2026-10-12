/** A watering can with a few drops. Shown for app updates and "ready offline": fresh and looked after. */
export function WateringCanIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      <path d="M31 54c-14 0-17 6-17 14s3 14 17 14" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path
        d="M72 58 94 42l5 6-22 18"
        fill="var(--color-tile-mint)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M30 46h44l-3 40a6 6 0 0 1-6 5H39a6 6 0 0 1-6-5Z"
        fill="var(--color-tile-sea)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path d="M36 46c4-9 34-9 38 0" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M100 58c0 4-3 7-3 7s-3-3-3-7a3 3 0 0 1 6 0Z" fill="var(--color-tile-sea)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M92 74c0 4-3 7-3 7s-3-3-3-7a3 3 0 0 1 6 0Z" fill="var(--color-tile-sea)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      <path className="sparkle" d="M20 82l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="var(--color-forest)" opacity="0.7" />
    </svg>
  );
}
