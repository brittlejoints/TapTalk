/**
 * An unfurling fern frond. Shown on the empty "My words" page — the user's
 * own words grow here. The leaflets scale in one by one, each carrying its midrib.
 * Detail lines are 1.5 units at half strength so they read at 80px.
 */
export function FernIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Ground: a soft shadow, a pebble and a small seedling beside the frond */}
      <ellipse cx="56" cy="102" rx="36" ry="4" fill="var(--color-tile-sand)" />
      <ellipse cx="30" cy="100" rx="3.5" ry="2.5" fill="var(--color-tile-sand)" stroke="var(--color-forest)" strokeWidth="1.5" />
      <path d="M84 101V90" stroke="var(--color-forest)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M83 95c-5 0-8-2-9-6 5-1 8 1 9 6Z" fill="var(--color-tile-keylime)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      <path d="M85 92c1-5 5-7 9-6-1 5-5 7-9 6Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
      {/* Main stem */}
      <path className="grow-stem" d="M56 102V26" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      {/* Pairs of leaflets, growing from base to tip */}
      <g className="fern-leaf" style={{ animationDelay: '150ms' }}>
        <path d="M56 86c-10 0-18-4-22-12 10-2 18 2 22 12Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M55 85Q45 81.8 36 75.5" {...vein} />
      </g>
      <g className="fern-leaf right" style={{ animationDelay: '220ms' }}>
        <path d="M56 86c10 0 18-4 22-12-10-2-18 2-22 12Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M57 85Q67 81.8 76 75.5" {...vein} />
      </g>
      <g className="fern-leaf" style={{ animationDelay: '320ms' }}>
        <path d="M56 72c-8 0-15-4-18-10 8-2 15 1 18 10Z" fill="var(--color-tile-mint)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M55 71Q47 68.5 40 63.5" {...vein} />
      </g>
      <g className="fern-leaf right" style={{ animationDelay: '390ms' }}>
        <path d="M56 72c8 0 15-4 18-10-8-2-15 1-18 10Z" fill="var(--color-tile-mint)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M57 71Q65 68.5 72 63.5" {...vein} />
      </g>
      <g className="fern-leaf" style={{ animationDelay: '490ms' }}>
        <path d="M56 58c-6 0-12-3-14-8 6-1 12 1 14 8Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M55 57Q49 55.2 44 51.5" {...vein} />
      </g>
      <g className="fern-leaf right" style={{ animationDelay: '560ms' }}>
        <path d="M56 58c6 0 12-3 14-8-6-1-12 1-14 8Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M57 57Q63 55.2 68 51.5" {...vein} />
      </g>
      <g className="fern-leaf" style={{ animationDelay: '660ms' }}>
        <path d="M56 46c-4 0-8-2-10-5 4-1 8 0 10 5Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M55 45Q51 44.25 48 42.5" {...vein} />
      </g>
      <g className="fern-leaf right" style={{ animationDelay: '730ms' }}>
        <path d="M56 46c4 0 8-2 10-5-4-1-8 0-10 5Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M57 45Q61 44.25 64 42.5" {...vein} />
      </g>
      {/* Curled tip */}
      <path
        className="grow-leaf"
        style={{ transformOrigin: '56px 30px' }}
        d="M56 32c0-6 5-10 8-6 2 3-1 7-5 7 2 3 6 2 7-1"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
