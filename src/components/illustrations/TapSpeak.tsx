/**
 * Tiles, a tap, and the speak button with leaves drifting up: "tap words, then tap Speak".
 * Shown on the second onboarding step.
 */
export function TapSpeakIllustration({ className = '' }: { className?: string }) {
  const stroke = { stroke: 'var(--color-forest)', strokeWidth: 2.5, strokeLinejoin: 'round', strokeLinecap: 'round' } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Message bar with two chips and the speak button */}
      <rect x="10" y="14" width="92" height="34" rx="12" fill="var(--color-keylime)" {...stroke} />
      <rect x="17" y="22" width="22" height="18" rx="9" fill="var(--color-tile-mint)" {...stroke} strokeWidth={2} />
      <rect x="43" y="22" width="22" height="18" rx="9" fill="var(--color-tile-peach)" {...stroke} strokeWidth={2} />
      <path d="M23 31h10M49 31h10" stroke="var(--color-forest)" strokeWidth={2} strokeLinecap="round" opacity="0.5" />
      <rect x="71" y="19" width="26" height="24" rx="8" fill="var(--color-forest)" {...stroke} />
      <path d="M80 26v10M84 24v14M88 28v6" stroke="var(--color-cream)" strokeWidth={2.5} strokeLinecap="round" />
      {/* Leaves drifting up from the speak button */}
      <path className="grow-leaf right" d="M100 12c-2-5-7-7-12-6 1 5 6 8 12 6Z" fill="var(--color-sage)" {...stroke} strokeWidth={2} />
      <path className="sparkle" d="M104 24l1.2 3 3 1.2-3 1.2-1.2 3-1.2-3-3-1.2 3-1.2Z" fill="var(--color-forest)" opacity="0.7" />
      {/* Three tiles, the middle one being tapped */}
      <rect x="10" y="64" width="28" height="30" rx="9" fill="var(--color-tile-butter)" {...stroke} />
      <rect x="42" y="64" width="28" height="30" rx="9" fill="var(--color-tile-peach)" {...stroke} />
      <rect x="74" y="64" width="28" height="30" rx="9" fill="var(--color-tile-sea)" {...stroke} />
      {/* Each tile has a picture and a label bar, like the real ones */}
      <path d="M17 87h14M49 87h14M81 87h14" stroke="var(--color-forest)" strokeWidth={2.5} strokeLinecap="round" opacity="0.5" />
      <path d="M24 70l1.7 3.4 3.8.5-2.8 2.6.7 3.8L24 78.5l-3.4 1.8.7-3.8-2.8-2.6 3.8-.5Z" stroke="var(--color-forest)" strokeWidth={2} strokeLinejoin="round" />
      <path d="M88 68c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10Z" stroke="var(--color-forest)" strokeWidth={2} strokeLinejoin="round" />
      {/* The tap: a fingertip with two ripples */}
      <circle cx="56" cy="79" r="4" fill="var(--color-forest)" />
      <path d="M48 71a11 11 0 0 1 16 0M44 67a17 17 0 0 1 24 0" stroke="var(--color-forest)" strokeWidth={2.5} strokeLinecap="round" opacity="0.55" />
      {/* Ground line */}
      <path d="M22 102h68" stroke="var(--color-tile-sand)" strokeWidth={4} strokeLinecap="round" />
    </svg>
  );
}
