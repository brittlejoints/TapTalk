import { beforeEach, describe, expect, it } from 'vitest';
import {
  COUNTERS,
  buildReport,
  cleanRef,
  freshState,
  loadInsights,
  rollWeek,
  setOptIn,
  screenClass,
  startInsights,
  tileBucket,
  weekOf,
  weeksBetween,
} from './insights';

const snap = { language: 'en-US', textSize: 'large', customTiles: 7, hasContacts: true, playful: true, speakOnTap: false, highVisibility: false };

beforeEach(() => localStorage.clear());

describe('insights', () => {
  it('weeks start on Monday', () => {
    expect(weekOf(new Date(2026, 9, 26))).toBe('2026-10-26'); // Monday
    expect(weekOf(new Date(2026, 10, 1))).toBe('2026-10-26'); // Sunday
    expect(weeksBetween('2026-10-05', '2026-10-26')).toBe(3);
  });

  it('keeps only a plain marketing tag', () => {
    expect(cleanRef('Instagram-Fall')).toBe('instagram-fall');
    expect(cleanRef('a b')).toBeNull();
    expect(cleanRef('x'.repeat(33))).toBeNull();
    expect(cleanRef('<script>')).toBeNull();
    expect(cleanRef(null)).toBeNull();
  });

  it('remembers the first week and tag once, on this device', () => {
    startInsights('?ref=newsletter', new Date(2026, 9, 26));
    const later = startInsights('?ref=other', new Date(2026, 10, 9));
    expect(later.firstWeek).toBe('2026-10-26');
    expect(later.ref).toBe('newsletter');
    expect(later.optIn).toBe(false);
  });

  it('moves a finished week to pending and drops stale ones', () => {
    const s = { ...freshState(new Date(2026, 9, 5), null), optIn: true };
    s.counts = { ...s.counts, messagesSpoken: 4 };
    const next = rollWeek(s, new Date(2026, 9, 14));
    expect(next.pending).toEqual({ week: '2026-10-05', counts: s.counts });
    expect(next.counts.messagesSpoken).toBe(0);
    expect(rollWeek(next, new Date(2027, 0, 4)).pending).toBeNull();
  });

  it('an empty week does not replace one still waiting to be sent', () => {
    const s = { ...freshState(new Date(2026, 9, 5), null), optIn: true, pending: { week: '2026-09-28', counts: { ...freshState(new Date(), null).counts, sessions: 2 } } };
    expect(rollWeek(s, new Date(2026, 9, 14)).pending?.week).toBe('2026-09-28');
  });

  it('turning sharing off clears every count and the pending week', () => {
    startInsights('', new Date(2026, 9, 26));
    setOptIn(true, new Date(2026, 9, 26));
    const off = setOptIn(false, new Date(2026, 9, 26));
    expect(off.optIn).toBe(false);
    expect(off.pending).toBeNull();
    expect(Object.values(off.counts).every((n) => n === 0)).toBe(true);
    expect(loadInsights().optIn).toBe(false);
  });

  it('a report holds only counts and coarse facts, never free text', () => {
    const s = freshState(new Date(2026, 9, 5), 'flyer');
    const r = buildReport('2026-10-19', s.counts, s, snap, { screen: 'tablet', installed: true });
    expect(Object.keys(r).sort()).toEqual(
      ['appVersion', 'counts', 'customTiles', 'hasContacts', 'highVisibility', 'installed', 'language', 'playful', 'ref', 'screen', 'speakOnTap', 'textSize', 'v', 'week', 'weeksSinceFirstUse'].sort(),
    );
    expect(Object.keys(r.counts).sort()).toEqual([...COUNTERS].sort());
    expect(r.weeksSinceFirstUse).toBe(2);
    expect(r.customTiles).toBe('6-20');
  });

  it('buckets tiles and screens coarsely', () => {
    expect([0, 1, 5, 6, 20, 21].map(tileBucket)).toEqual(['0', '1-5', '1-5', '6-20', '6-20', '21+']);
    expect(screenClass(390, 844)).toBe('phone');
    expect(screenClass(1180, 820)).toBe('tablet');
    expect(screenClass(1920, 1200)).toBe('desktop');
  });
});
