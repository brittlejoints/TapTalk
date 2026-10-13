import type { CSSProperties } from 'react';

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
 * Motion (CSS in index.css; each plays once, only with playful touches on):
 * - `draw`: the strokes draw themselves in order, left to right (welcome screen).
 * - `wave`: each change replays a small left-to-right hop of the letters (Speak tapped).
 * - `talkPulse`: each change (one per spoken word) replays a small bar bounce.
 * Every stroke carries its order in `--i`, and pathLength=1 lets one rule draw any of them.
 */
interface WordmarkProps {
  className?: string;
  /** Increments once per spoken word; each change replays the bar bounce. */
  talkPulse?: number;
  /** Increments each time Speak is tapped; each change replays the letter hop. */
  wave?: number;
  /** Draw the strokes in once on mount. */
  draw?: boolean;
}

const order = (i: number) => ({ '--i': i }) as CSSProperties;

export function Wordmark({ className = '', talkPulse = 0, wave = 0, draw = false }: WordmarkProps) {
  const waveClass = wave > 0 ? 'wm-wave' : undefined;
  return (
    <svg
      viewBox="0 14 333 96"
      className={`${className}${draw ? ' wm-draw' : ''}`}
      style={{ overflow: 'visible' }}
      role="img"
      aria-label="Tap Talk"
      fill="none"
      stroke="currentColor"
      strokeWidth="11"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g key={`left-${wave}`} className={waveClass}>
        {/* t */}
        <path className="wm-l" style={order(0)} pathLength={1} d="M15.5 20v44q0 12 12 12" />
        <path className="wm-l" style={order(1)} pathLength={1} d="M5.5 44h22" />
        {/* a */}
        <circle className="wm-l" style={order(2)} pathLength={1} cx="60.5" cy="60" r="16" />
        <path className="wm-l" style={order(3)} pathLength={1} d="M76.5 44v32" />
        {/* p */}
        <path className="wm-l" style={order(4)} pathLength={1} d="M95.5 44v60" />
        <circle className="wm-l" style={order(5)} pathLength={1} cx="111.5" cy="60" r="16" />
        {/* t */}
        <path className="wm-l" style={order(6)} pathLength={1} d="M168.5 20v44q0 12 12 12" />
        <path className="wm-l" style={order(7)} pathLength={1} d="M158.5 44h22" />
        {/* a */}
        <circle className="wm-l" style={order(8)} pathLength={1} cx="213.5" cy="60" r="16" />
        <path className="wm-l" style={order(9)} pathLength={1} d="M229.5 44v32" />
      </g>
      {/* l, as the icon's sound bars (proportions 64 : 112 : 44) */}
      <g key={talkPulse} className={talkPulse > 0 ? 'talk-bars' : undefined}>
        <path className="wm-bar" style={order(10)} pathLength={1} d="M251.5 49v27" />
        <path className="wm-bar" style={order(11)} pathLength={1} d="M267.5 20v56" />
        <path className="wm-bar" style={order(12)} pathLength={1} d="M283.5 61v15" />
      </g>
      <g key={`right-${wave}`} className={waveClass}>
        {/* k */}
        <path className="wm-l" style={order(13)} pathLength={1} d="M305.5 20v56" />
        <path className="wm-l" style={order(14)} pathLength={1} d="M307.5 62l18-18" />
        <path className="wm-l" style={order(15)} pathLength={1} d="M314.5 56l12.5 20" />
      </g>
    </svg>
  );
}
