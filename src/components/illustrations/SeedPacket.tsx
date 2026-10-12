/** A seed packet with a sprout on its label. Shown when there are no custom tiles yet: words are planted here. */
export function SeedPacketIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      <path
        d="M30 22h52v10H30Z"
        fill="var(--color-tile-sand)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M30 32h52l3 62a4 4 0 0 1-4 4H31a4 4 0 0 1-4-4Z"
        fill="var(--color-tile-butter)"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <rect x="38" y="46" width="36" height="34" rx="8" fill="var(--color-cream)" stroke="var(--color-forest)" strokeWidth="2" />
      <path className="grow-stem" d="M56 74V58" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path
        className="grow-leaf left"
        d="M55 66c-7 0-11-3-12-9 7-1 11 2 12 9Z"
        fill="var(--color-sage)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        className="grow-leaf right"
        d="M57 62c1-6 6-9 12-8-1 6-6 9-12 8Z"
        fill="var(--color-tile-keylime)"
        stroke="var(--color-forest)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
