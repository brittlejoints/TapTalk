/**
 * Splits a category's words into fixed 3x3 pages.
 *
 * Up to 9 words fit on one page. Beyond that, the last slot of every page
 * becomes a "More" tile, so navigation is always in the same place and no
 * extra row is needed (a common pattern in AAC apps).
 */
export interface Page<T> {
  /** Exactly `perPage` slots; `null` means an empty slot. */
  slots: (T | null)[];
  /** True when the last slot is the "More" tile. */
  hasMore: boolean;
  index: number;
  count: number;
}

export function paginate<T>(items: T[], perPage: number, pageIndex: number): Page<T> {
  const needsPaging = items.length > perPage;
  const perPageItems = needsPaging ? perPage - 1 : perPage;
  const count = Math.max(1, Math.ceil(items.length / perPageItems));
  const index = ((pageIndex % count) + count) % count;
  const pageItems = items.slice(index * perPageItems, (index + 1) * perPageItems);
  const slots: (T | null)[] = Array.from({ length: perPageItems }, (_, i) => pageItems[i] ?? null);
  if (needsPaging) slots.push(null); // the "More" slot, rendered by the grid
  return { slots, hasMore: needsPaging, index, count };
}
