/**
 * An unfurling fern frond. Shown on the empty "My words" page — the user's
 * own words grow here. The leaflets scale in one by one.
 */
export function FernIllustration({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {/* Main stem */}
      <path className="grow-stem" d="M56 100V26" stroke="var(--color-forest)" strokeWidth="3" strokeLinecap="round" />
      {/* Pairs of leaflets, growing from base to tip */}
      <g stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" fill="var(--color-sage)">
        <path className="fern-leaf" style={{ animationDelay: '150ms' }} d="M56 86c-10 0-18-4-22-12 10-2 18 2 22 12Z" />
        <path className="fern-leaf right" style={{ animationDelay: '220ms' }} d="M56 86c10 0 18-4 22-12-10-2-18 2-22 12Z" />
      </g>
      <g stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" fill="var(--color-tile-mint)">
        <path className="fern-leaf" style={{ animationDelay: '320ms' }} d="M56 72c-8 0-15-4-18-10 8-2 15 1 18 10Z" />
        <path className="fern-leaf right" style={{ animationDelay: '390ms' }} d="M56 72c8 0 15-4 18-10-8-2-15 1-18 10Z" />
      </g>
      <g stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" fill="var(--color-sage)">
        <path className="fern-leaf" style={{ animationDelay: '490ms' }} d="M56 58c-6 0-12-3-14-8 6-1 12 1 14 8Z" />
        <path className="fern-leaf right" style={{ animationDelay: '560ms' }} d="M56 58c6 0 12-3 14-8-6-1-12 1-14 8Z" />
      </g>
      <g stroke="var(--color-forest)" strokeWidth="2" strokeLinejoin="round" fill="var(--color-tile-butter)">
        <path className="fern-leaf" style={{ animationDelay: '660ms' }} d="M56 46c-4 0-8-2-10-5 4-1 8 0 10 5Z" />
        <path className="fern-leaf right" style={{ animationDelay: '730ms' }} d="M56 46c4 0 8-2 10-5-4-1-8 0-10 5Z" />
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
