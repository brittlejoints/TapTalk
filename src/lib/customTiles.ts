import { useState } from 'react';
import { isTileColorId, type TileColorId } from '../data/colors';
import { isTileIconId, type TileIconId } from '../data/icons';
import type { CategoryId } from '../data/vocabulary';
import { loadJSON, saveJSON } from './storage';

export type CustomCategoryId = Exclude<CategoryId, 'saved'>;

export interface CustomTile {
  id: string;
  label: string;
  category: CustomCategoryId;
  color: TileColorId;
  icon: TileIconId;
  /** Optional photo as a small JPEG data URL. Shown instead of the icon. */
  photo?: string;
}

export const MAX_LABEL_LENGTH = 40;
const CUSTOM_CATEGORIES: CustomCategoryId[] = ['needs', 'feelings', 'people', 'medical'];

function isCustomTile(value: unknown): value is CustomTile {
  if (typeof value !== 'object' || value === null) return false;
  const t = value as Record<string, unknown>;
  return (
    typeof t.id === 'string' &&
    typeof t.label === 'string' &&
    t.label.trim().length > 0 &&
    t.label.length <= MAX_LABEL_LENGTH &&
    CUSTOM_CATEGORIES.includes(t.category as CustomCategoryId) &&
    isTileColorId(t.color) &&
    isTileIconId(t.icon) &&
    (t.photo === undefined || (typeof t.photo === 'string' && t.photo.startsWith('data:image/')))
  );
}

/** Keeps every valid tile, so one bad entry never wipes out the rest. */
function loadTiles(): CustomTile[] {
  const raw = loadJSON<unknown[]>('custom-tiles', [], Array.isArray);
  return raw.filter(isCustomTile);
}

export function useCustomTiles() {
  const [tiles, setTiles] = useState<CustomTile[]>(loadTiles);

  /** Saves a new or edited tile. Returns false if device storage is full. */
  const saveTile = (tile: CustomTile): boolean => {
    const exists = tiles.some((t) => t.id === tile.id);
    const next = exists ? tiles.map((t) => (t.id === tile.id ? tile : t)) : [...tiles, tile];
    if (!saveJSON('custom-tiles', next)) return false;
    setTiles(next);
    return true;
  };

  const removeTile = (id: string) => {
    const next = tiles.filter((t) => t.id !== id);
    saveJSON('custom-tiles', next);
    setTiles(next);
  };

  return { tiles, saveTile, removeTile };
}
