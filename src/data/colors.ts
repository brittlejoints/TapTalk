/** Light tile colors. Each id maps to a --color-tile-* token in index.css. */
export const TILE_COLORS = [
  { id: 'keylime', label: 'Keylime' },
  { id: 'mint', label: 'Mint' },
  { id: 'sea', label: 'Sea glass' },
  { id: 'mist', label: 'Mist' },
  { id: 'lilac', label: 'Lilac' },
  { id: 'butter', label: 'Butter' },
  { id: 'peach', label: 'Peach' },
  { id: 'sand', label: 'Sand' },
] as const;

export type TileColorId = (typeof TILE_COLORS)[number]['id'];

/** Written out in full so Tailwind can find the class names at build time. */
export const TILE_COLOR_CLASS: Record<TileColorId, string> = {
  keylime: 'bg-tile-keylime',
  mint: 'bg-tile-mint',
  sea: 'bg-tile-sea',
  mist: 'bg-tile-mist',
  lilac: 'bg-tile-lilac',
  butter: 'bg-tile-butter',
  peach: 'bg-tile-peach',
  sand: 'bg-tile-sand',
};

export function isTileColorId(value: unknown): value is TileColorId {
  return typeof value === 'string' && value in TILE_COLOR_CLASS;
}
