import { describe, expect, it } from 'vitest';
import { boardPage } from './boardPages';

const words = (prefix: string, n: number) => Array.from({ length: n }, (_, i) => `${prefix}${i + 1}`);
const labels = (slots: ReturnType<typeof boardPage<string>>['slots']) =>
  slots.map((s) => (s === null ? null : s.kind === 'word' ? s.word : s.kind));

describe('boardPage', () => {
  it('shows 8 built-in words with "My words" in slot 9', () => {
    const p = boardPage(words('b', 8), [], 0);
    expect(labels(p.slots)).toEqual([...words('b', 8), 'mine']);
  });

  it('never moves built-in words when custom tiles are added', () => {
    const before = boardPage(words('b', 8), [], 0).slots;
    const after = boardPage(words('b', 8), words('c', 5), 0).slots;
    expect(labels(after).slice(0, 8)).toEqual(labels(before).slice(0, 8));
    expect(after[8]).toEqual({ kind: 'mine', count: 5 });
  });

  it('puts custom tiles on their own page, ending with Back', () => {
    const p = boardPage(words('b', 8), words('c', 3), 1);
    expect(labels(p.slots)).toEqual(['c1', 'c2', 'c3', null, null, null, null, null, 'back']);
  });

  it('adds More when custom tiles need several pages', () => {
    const custom = words('c', 10);
    expect(boardPage(words('b', 8), custom, 1).slots[8]).toEqual({ kind: 'more', page: 1, pages: 2 });
    expect(labels(boardPage(words('b', 8), custom, 2).slots).slice(0, 3)).toEqual(['c9', 'c10', null]);
    expect(boardPage(words('b', 8), custom, 2).slots[8]).toEqual({ kind: 'back' });
  });

  it('allows an empty "My words" page, and falls back to page 0 when out of range', () => {
    expect(boardPage(words('b', 8), [], 1).page).toBe(1);
    expect(boardPage(words('b', 8), words('c', 3), 5).page).toBe(0);
  });
});
