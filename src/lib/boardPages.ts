/**
 * Lays out one page of a category's 3x3 grid.
 *
 * Slots 1-8 hold words. Slot 9 is ALWAYS navigation, reserved from the start,
 * so adding the user's own tiles never moves a built-in word:
 *   - page 0 (built-in words): slot 9 is "My words", which opens the user's tiles
 *   - pages 1+ (the user's tiles): slot 9 is "More" if another page follows, otherwise "Back"
 */

export const WORDS_PER_PAGE = 8;

export type Slot<T> =
  | { kind: 'word'; word: T }
  | { kind: 'mine'; count: number }
  | { kind: 'more'; page: number; pages: number }
  | { kind: 'back' }
  | null;

export interface BoardPage<T> {
  slots: Slot<T>[];
  /** The page actually shown (out-of-range pages fall back to 0). */
  page: number;
  /** Number of pages of the user's own tiles (at least 1, so "My words" can show an empty page). */
  customPages: number;
}

function fill<T>(items: T[]): Slot<T>[] {
  return Array.from({ length: WORDS_PER_PAGE }, (_, i) => (i < items.length ? { kind: 'word', word: items[i] } : null));
}

export function boardPage<T>(builtIn: T[], custom: T[], requestedPage: number): BoardPage<T> {
  const customPages = Math.max(1, Math.ceil(custom.length / WORDS_PER_PAGE));
  const page = requestedPage >= 0 && requestedPage <= customPages ? requestedPage : 0;

  if (page === 0) {
    return { page, customPages, slots: [...fill(builtIn.slice(0, WORDS_PER_PAGE)), { kind: 'mine', count: custom.length }] };
  }

  const items = custom.slice((page - 1) * WORDS_PER_PAGE, page * WORDS_PER_PAGE);
  const nav: Slot<T> = page < customPages ? { kind: 'more', page, pages: customPages } : { kind: 'back' };
  return { page, customPages, slots: [...fill(items), nav] };
}
