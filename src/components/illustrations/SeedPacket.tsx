/** A seed packet with a sprout on its label. Shown when there are no custom tiles yet: words are planted here. */
export function SeedPacketIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Ground, and a few seeds that have spilled out */}
      <ellipse cx="56" cy="102" rx="40" ry="4" fill="var(--color-tile-sand)" />
      <g fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="1.5">
        <ellipse cx="94" cy="98" rx="3" ry="1.8" transform="rotate(-25 94 98)" />
        <ellipse cx="101" cy="101" rx="3" ry="1.8" transform="rotate(15 101 101)" />
        <ellipse cx="22" cy="100" rx="3" ry="1.8" transform="rotate(10 22 100)" />
      </g>
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
      {/* Crimped top edge, and a fold highlight down the left side */}
      <path d="M36 25v4M42 25v4M48 25v4M54 25v4M60 25v4M66 25v4M72 25v4M78 25v4" {...vein} />
      <path d="M34 40l2 46" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      <rect x="38" y="46" width="36" height="34" rx="8" fill="var(--color-cream)" stroke="var(--color-forest)" strokeWidth="2" />
      {/* Label: a name and a line of small print */}
      <path d="M44 86h24" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <path d="M48 92h16" {...vein} />
      <path className="grow-stem" d="M56 74V58" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <g className="grow-leaf left">
        <path d="M55 66c-7 0-11-3-12-9 7-1 11 2 12 9Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M53.5 64.5C49 63 46 60.5 44.5 58.5" {...vein} />
      </g>
      <g className="grow-leaf right">
        <path d="M57 62c1-6 6-9 12-8-1 6-6 9-12 8Z" fill="var(--color-tile-keylime)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M58.5 60.5C61.5 58 64.5 56.5 67 55.5" {...vein} />
      </g>
    </svg>
  );
}
