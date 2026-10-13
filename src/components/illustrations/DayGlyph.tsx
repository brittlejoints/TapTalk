import type { DayPeriod } from '../../lib/greeting';

/** A tiny sunrise, sun or moon beside the time-of-day greeting. Still, never animated. */
export function DayGlyphIllustration({ period, className = '' }: { period: DayPeriod; className?: string }) {
  const stroke = { stroke: 'var(--color-forest)', strokeWidth: 6, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg viewBox="0 0 112 112" className={className} aria-hidden="true" fill="none">
      {period === 'morning' && (
        <>
          <path d="M28 76a28 28 0 0 1 56 0Z" fill="var(--color-tile-butter)" {...stroke} />
          <path d="M12 76h88" {...stroke} />
          <path d="M56 22v10M24 36l7 7M88 36l-7 7" {...stroke} />
        </>
      )}
      {period === 'afternoon' && (
        <>
          <circle cx="56" cy="56" r="20" fill="var(--color-tile-butter)" {...stroke} />
          <path d="M56 12v10M56 90v10M12 56h10M90 56h10M25 25l7 7M80 80l7 7M87 25l-7 7M32 80l-7 7" {...stroke} />
        </>
      )}
      {period === 'evening' && (
        <>
          <path d="M70 18a38 38 0 1 0 28 56A32 32 0 0 1 70 18Z" fill="var(--color-tile-lilac)" {...stroke} />
          <path d="M92 24v12M86 30h12" {...stroke} strokeWidth={5} />
        </>
      )}
    </svg>
  );
}
