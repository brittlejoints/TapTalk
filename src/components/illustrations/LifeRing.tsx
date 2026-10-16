/**
 * A life ring with four straps and a rope looped around it, in peach and cream
 * (never red: red is only for the Help button and screen). Shown on the onboarding
 * step about Help. The rope runs behind the ring and the straps sit on top of it.
 */
const STRAPS = [45, 135, 225, 315];

export function LifeRingIllustration({ className = '' }: { className?: string }) {
  const vein = { stroke: 'var(--color-forest)', strokeWidth: 1.5, strokeLinecap: 'round', opacity: 0.55 } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Water under the ring */}
      <path d="M8 104q7-5 14 0t14 0 14 0 14 0 14 0" stroke="var(--color-tile-sea)" strokeWidth="4" strokeLinecap="round" />
      <path d="M30 110q6-4 12 0t12 0 12 0" stroke="var(--color-tile-mist)" strokeWidth="3" strokeLinecap="round" />
      {/* Rope: four loops between the straps, bowing out past the ring */}
      <path
        d="M79.46 38.95C98.30 43.87 98.30 68.13 79.46 73.05M73.05 79.46C68.13 98.30 43.87 98.30 38.95 79.46M32.54 73.05C13.70 68.13 13.70 43.87 32.54 38.95M38.95 32.54C43.87 13.70 68.13 13.70 73.05 32.54"
        stroke="var(--color-forest)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Ring body in peach, with its outer and inner edges */}
      <circle cx="56" cy="56" r="21.5" stroke="var(--color-tile-peach)" strokeWidth="13" />
      <circle cx="56" cy="56" r="28" stroke="var(--color-forest)" strokeWidth="2.5" />
      <circle cx="56" cy="56" r="15" stroke="var(--color-forest)" strokeWidth="2.5" />
      {/* A highlight on the ring's left side */}
      <path d="M33.4 47.8A24 24 0 0 0 33.4 64.2" stroke="var(--color-cream)" strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      {/* Four cream straps across the ring, each a little wider than it */}
      {STRAPS.map((a) => (
        <g key={a} transform={`rotate(${a - 90} 56 56)`}>
          <rect x="49.5" y="68" width="13" height="19.5" rx="3.5" fill="var(--color-cream)" stroke="var(--color-forest)" strokeWidth="2.5" />
        </g>
      ))}
      {/* A sprout poking up beside it: help that grows with you */}
      <path className="grow-stem" d="M97 98V82" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      <g className="grow-leaf left"><path d="M96 90c-7 0-11-3-12-9 7-1 11 2 12 9Z" fill="var(--color-sage)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" /><path d="M94.5 88.5C90 87 87 84.5 85.5 82.5" {...vein} /></g>
      <g className="grow-leaf right"><path d="M98 86c1-6 6-9 12-8-1 6-6 9-12 8Z" fill="var(--color-tile-butter)" stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" /><path d="M99.5 84.5C102.5 82 105.5 80.5 108 79.5" {...vein} /></g>
      <path className="sparkle" d="M18 18l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z" fill="var(--color-forest)" opacity="0.7" />
    </svg>
  );
}
