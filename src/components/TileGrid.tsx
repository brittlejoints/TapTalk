import { MessageCircle } from 'lucide-react';
import { SURFACE_CLASS, TILES_PER_PAGE, type Category, type Word } from '../data/vocabulary';

interface TileGridProps {
  category: Category;
  /** Used instead of category.words for the Saved page. */
  phrases?: string[];
  onTile: (label: string) => void;
}

/**
 * A fixed 3x3 grid that fills the remaining screen height. Empty slots are kept
 * as blank space, so every tile stays in the same position from page to page.
 */
export function TileGrid({ category, phrases, onTile }: TileGridProps) {
  const isPhrasePage = phrases !== undefined;
  const words: Word[] = isPhrasePage
    ? phrases.map((label) => ({ label, icon: MessageCircle }))
    : category.words;
  const slots = Array.from({ length: TILES_PER_PAGE }, (_, i) => words[i]);
  const surface = SURFACE_CLASS[category.surface];

  return (
    <div
      id="tile-grid"
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
      className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-[7px]"
    >
      {slots.map((word, i) =>
        word ? (
          <button
            key={`${category.id}-${i}`}
            type="button"
            onClick={() => onTile(word.label)}
            className={`pressable flex flex-col items-center justify-center gap-[7px] rounded-tile p-[7px] text-center leading-tight text-forest ${surface} ${
              isPhrasePage ? 'text-[15px] font-medium' : 'text-tile font-semibold'
            }`}
          >
            <word.icon
              size={isPhrasePage ? 20 : 32}
              strokeWidth={1.6}
              aria-hidden="true"
            />
            {word.label}
          </button>
        ) : (
          <div key={`${category.id}-${i}`} aria-hidden="true" />
        ),
      )}
    </div>
  );
}
