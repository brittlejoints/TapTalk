import { isTileColorId, type TileColorId } from '../data/colors';
import { CORE_WORD_IDS, type CoreWordId } from '../data/coreWords';

/** The quick-word row always has exactly this many slots. */
export const CORE_SLOT_COUNT = 4;
export const MAX_CORE_LABEL_LENGTH = 12;

export type CoreSlot =
  | { kind: 'builtin'; id: CoreWordId }
  | { kind: 'custom'; label: string; color: TileColorId };

export type CoreSlots = [CoreSlot, CoreSlot, CoreSlot, CoreSlot];

export const DEFAULT_CORE_SLOTS: CoreSlots = [
  { kind: 'builtin', id: 'yes' },
  { kind: 'builtin', id: 'no' },
  { kind: 'builtin', id: 'stop' },
  { kind: 'builtin', id: 'more' },
];

function parseSlot(value: unknown): CoreSlot | null {
  if (typeof value !== 'object' || value === null) return null;
  const v = value as Record<string, unknown>;
  if (v.kind === 'builtin' && (CORE_WORD_IDS as readonly unknown[]).includes(v.id)) {
    return { kind: 'builtin', id: v.id as CoreWordId };
  }
  if (v.kind === 'custom' && typeof v.label === 'string') {
    const label = v.label.trim().slice(0, MAX_CORE_LABEL_LENGTH);
    if (label && isTileColorId(v.color)) return { kind: 'custom', label, color: v.color };
  }
  return null;
}

/** Always returns exactly four slots. A missing or invalid slot falls back to its default, so the row can never shrink or grow. */
export function normalizeCoreSlots(raw: unknown): CoreSlots {
  const list = Array.isArray(raw) ? raw : [];
  return DEFAULT_CORE_SLOTS.map((fallback, i) => parseSlot(list[i]) ?? fallback) as CoreSlots;
}

/** Replaces one slot and returns a new four-slot list. */
export function withCoreSlot(slots: CoreSlots, index: number, slot: CoreSlot): CoreSlots {
  if (index < 0 || index >= CORE_SLOT_COUNT) return slots;
  return normalizeCoreSlots(slots.map((s, i) => (i === index ? slot : s)));
}
