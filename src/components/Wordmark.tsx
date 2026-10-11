/**
 * The Tap Talk wordmark, drawn rather than typeset: every letter uses one
 * 11-unit rounded stroke (the same stroke as the app icon's sound bars), and
 * the "l" of talk is the icon's three bars.
 *
 * Grid (stroke centerlines): baseline 76, x-height 44, ascender 20, descender 104.
 * Bowls are r=16 circles centered on y=60, so their outer edges land exactly on
 * the x-height and baseline. Gaps between letters are optically even (~8 units),
 * tighter between t and a where the crossbar leaves open space. The bars sit
 * 5 apart inside and 11 from their neighbors, so they read as one letter.
 *
 * Each change of `talkPulse` (one per spoken word) replays a small bar bounce.
 */
interface WordmarkProps {
  className?: string;
  /** Increments once per spoken word; each change replays the bar bounce. */
  talkPulse?: number;
}

export function Wordmark({ className = '', talkPulse = 0 }: WordmarkProps) {
  return (
    <svg
      viewBox="0 14 333 96"
      className={className}
      role="img"
      aria-label="Tap Talk"
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* t */}
      <path d="M15.5 20v44q0 12 12 12" />
      <path d="M5.5 44h22" />
      {/* a */}
      <circle cx="60.5" cy="60" r="16" />
      <path d="M76.5 44v32" />
      {/* p */}
      <path d="M95.5 44v60" />
      <circle cx="111.5" cy="60" r="16" />
      {/* t */}
      <path d="M168.5 20v44q0 12 12 12" />
      <path d="M158.5 44h22" />
      {/* a */}
      <circle cx="213.5" cy="60" r="16" />
      <path d="M229.5 44v32" />
      {/* l, as the icon's sound bars (proportions 64 : 112 : 44) */}
      <g key={talkPulse} className={talkPulse > 0 ? 'talk-bars' : undefined}>
        <path d="M251.5 49v27" />
        <path d="M267.5 20v56" />
        <path d="M283.5 61v15" />
      </g>
      {/* k */}
      <path d="M305.5 20v56" />
      <path d="M307.5 62l18-18" />
      <path d="M314.5 56l12.5 20" />
    </svg>
  );
}
