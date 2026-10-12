import { describe, expect, it } from 'vitest';
import { CORE_SLOT_COUNT, DEFAULT_CORE_SLOTS, normalizeCoreSlots, withCoreSlot } from './coreWords';

describe('core word slots', () => {
  it('always returns exactly four slots', () => {
    expect(normalizeCoreSlots(undefined)).toEqual(DEFAULT_CORE_SLOTS);
    expect(normalizeCoreSlots([])).toHaveLength(CORE_SLOT_COUNT);
    const tooMany = Array.from({ length: 9 }, () => ({ kind: 'builtin', id: 'go' }));
    expect(normalizeCoreSlots(tooMany)).toHaveLength(CORE_SLOT_COUNT);
  });

  it('fills a missing or invalid slot with that position\'s default', () => {
    const s = normalizeCoreSlots([{ kind: 'builtin', id: 'wait' }, { kind: 'nope' }, null]);
    expect(s[0]).toEqual({ kind: 'builtin', id: 'wait' });
    expect(s[1]).toEqual(DEFAULT_CORE_SLOTS[1]);
    expect(s[2]).toEqual(DEFAULT_CORE_SLOTS[2]);
    expect(s[3]).toEqual(DEFAULT_CORE_SLOTS[3]);
  });

  it('trims and validates custom words', () => {
    const s = normalizeCoreSlots([{ kind: 'custom', label: '  Mum  ', color: 'peach' }, { kind: 'custom', label: '   ', color: 'peach' }]);
    expect(s[0]).toEqual({ kind: 'custom', label: 'Mum', color: 'peach' });
    expect(s[1]).toEqual(DEFAULT_CORE_SLOTS[1]);
    expect(normalizeCoreSlots([{ kind: 'custom', label: 'Hi', color: 'hotpink' }])[0]).toEqual(DEFAULT_CORE_SLOTS[0]);
  });

  it('changes one slot and leaves the other three', () => {
    const next = withCoreSlot(DEFAULT_CORE_SLOTS, 2, { kind: 'builtin', id: 'wait' });
    expect(next[2]).toEqual({ kind: 'builtin', id: 'wait' });
    expect([next[0], next[1], next[3]]).toEqual([DEFAULT_CORE_SLOTS[0], DEFAULT_CORE_SLOTS[1], DEFAULT_CORE_SLOTS[3]]);
    expect(withCoreSlot(DEFAULT_CORE_SLOTS, 7, { kind: 'builtin', id: 'go' })).toEqual(DEFAULT_CORE_SLOTS);
  });
});
