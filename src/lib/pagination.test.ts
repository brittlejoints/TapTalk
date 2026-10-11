import { describe, expect, it } from 'vitest';
import { paginate } from './pagination';

const words = (n: number) => Array.from({ length: n }, (_, i) => `w${i + 1}`);

describe('paginate', () => {
  it('fits up to 9 items on one page with no More tile', () => {
    const page = paginate(words(9), 9, 0);
    expect(page.hasMore).toBe(false);
    expect(page.count).toBe(1);
    expect(page.slots).toEqual(words(9));
  });

  it('pads short pages with empty slots so tiles never reflow', () => {
    expect(paginate(words(2), 9, 0).slots).toEqual(['w1', 'w2', null, null, null, null, null, null, null]);
  });

  it('reserves the last slot for More when there are more than 9 items', () => {
    const first = paginate(words(10), 9, 0);
    expect(first.hasMore).toBe(true);
    expect(first.count).toBe(2);
    expect(first.slots.slice(0, 8)).toEqual(words(8));
    expect(first.slots).toHaveLength(9);

    const second = paginate(words(10), 9, 1);
    expect(second.slots.slice(0, 2)).toEqual(['w9', 'w10']);
  });

  it('wraps back to the first page after the last', () => {
    expect(paginate(words(10), 9, 2).index).toBe(0);
  });
});
