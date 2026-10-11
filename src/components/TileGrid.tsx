import { ChevronRight, Sprout } from 'lucide-react';
import { TILES_PER_PAGE, type Category, type Word } from '../data/vocabulary';
import { paginate } from '../lib/pagination';
import { Tile } from './Tile';

interface TileGridProps {
  category: Category;
  words: Word[];
  page: number;
  variant?: 'word' | 'phrase';
  onTile: (label: string) => void;
  onNextPage: () => void;
}

/**
 * A fixed 3x3 grid that fills the remaining screen height. Empty slots stay
 * blank, so every tile keeps its position. When a category has more than 9
 * tiles, the last slot is always the "More" tile.
 */
export function TileGrid({ category, words, page, variant = 'word', onTile, onNextPage }: TileGridProps) {
  const { slots, hasMore, index, count } = paginate(words, TILES_PER_PAGE, page);

  if (words.length === 0) {
    return (
      <div
        id="tile-grid"
        role="tabpanel"
        aria-labelledby={`tab-${category.id}`}
        className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-tile bg-keylime p-7 text-center"
      >
        <Sprout size={40} strokeWidth={1.4} className="text-forest" aria-hidden="true" />
        <p className="font-display text-[28px] leading-tight font-light text-forest">Nothing saved yet</p>
        <p className="max-w-[28ch] text-charcoal">Build a message, then tap the star to keep it here.</p>
      </div>
    );
  }

  return (
    <div
      id="tile-grid"
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
      className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-[7px]"
    >
      {slots.map((word, i) => {
        const key = `${category.id}-${index}-${i}`;
        if (hasMore && i === slots.length - 1) {
          return (
            <button
              key={key}
              type="button"
              onClick={onNextPage}
              className="pressable flex flex-col items-center justify-center gap-1 rounded-tile bg-forest text-cream"
              aria-label={`More ${category.label.toLowerCase()} tiles, page ${index + 1} of ${count}`}
            >
              <ChevronRight size={30} aria-hidden="true" />
              <span className="font-semibold">More</span>
              <span className="text-xs opacity-80">
                {index + 1} of {count}
              </span>
            </button>
          );
        }
        return word ? (
          <Tile
            key={key}
            label={word.label}
            icon={word.icon}
            photo={word.photo}
            color={word.color ?? category.color}
            variant={variant}
            onClick={() => onTile(word.label)}
          />
        ) : (
          <div key={key} aria-hidden="true" />
        );
      })}
    </div>
  );
}
