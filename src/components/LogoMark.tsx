/**
 * The Tap Talk logo mark: a speech bubble holding three sound bars, the same
 * three bars as the "l" in the wordmark. One rounded 32-unit stroke on a
 * 512-unit grid (public/icons/icon.svg is the same drawing). Keep a clear gap
 * between every line: bars 56 apart, at least 22 inside the bubble. Never make
 * the stroke thicker, or the bars start to touch.
 */
export const MARK_STROKE = 32;

/** Centerline paths, in the 512-unit icon grid. */
export function MarkPaths() {
  return (
    <>
      <path d="M166 134h180a46 46 0 0 1 46 46v116a46 46 0 0 1-46 46H228l-62 56v-56h-20a46 46 0 0 1-46-46V180a46 46 0 0 1 46-46Z" />
      <path d="M200 246v42" />
      <path d="M256 190v98" />
      <path d="M312 269v19" />
    </>
  );
}

/** The mark alone, in the current text color (use `text-forest`). */
export function LogoMark({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="84 118 324 296"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={MARK_STROKE}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <MarkPaths />
    </svg>
  );
}

/** The app icon as a rounded tile: keylime mark on forest. */
export function AppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="var(--color-forest)" />
      <g
        fill="none"
        stroke="var(--color-keylime)"
        strokeWidth={MARK_STROKE}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <MarkPaths />
      </g>
    </svg>
  );
}
