import { ArrowLeft, ChevronRight, Sprout } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Category, Word } from '../data/vocabulary';
import type { Slot } from '../lib/boardPages';
import { Tile } from './Tile';

export type NavSlot = Exclude<Slot<Word>, { kind: 'word' } | null>;

interface TileGridProps {
  category: Category;
  slots: Slot<Word>[];
  variant?: 'word' | 'phrase';
  /** Shown in place of word slots, e.g. for an empty page. Navigation keeps its slot. */
  emptyMessage?: ReactNode;
  onTile: (label: string) => void;
  onNav: (slot: NavSlot) => void;
}

function NavTile({ slot, category, onNav }: { slot: NavSlot; category: Category; onNav: (slot: NavSlot) => void }) {
  const name = category.label.toLowerCase();
  const content =
    slot.kind === 'mine'
      ? { icon: <Sprout size={30} strokeWidth={1.6} aria-hidden="true" />, label: 'My words', sub: slot.count ? String(slot.count) : null, aria: `My ${name} words, ${slot.count} tiles` }
      : slot.kind === 'more'
        ? { icon: <ChevronRight size={30} aria-hidden="true" />, label: 'More', sub: `${slot.page} of ${slot.pages}`, aria: `More of my ${name} words, page ${slot.page} of ${slot.pages}` }
        : { icon: <ArrowLeft size={28} aria-hidden="true" />, label: 'Back', sub: null, aria: `Back to ${name}` };

  return (
    <button
      type="button"
      onClick={() => onNav(slot)}
      aria-label={content.aria}
      className="pressable flex flex-col items-center justify-center gap-1 rounded-tile bg-forest text-cream"
    >
      {content.icon}
      <span className="font-semibold">{content.label}</span>
      {content.sub && <span className="text-xs opacity-80">{content.sub}</span>}
    </button>
  );
}

/**
 * A fixed 3x3 grid that fills the remaining screen height. Empty slots stay
 * blank, and slot 9 is always navigation, so every tile keeps its position.
 */
export function TileGrid({ category, slots, variant = 'word', emptyMessage, onTile, onNav }: TileGridProps) {
  return (
    <div
      id="tile-grid"
      role="tabpanel"
      aria-labelledby={`tab-${category.id}`}
      className="grid min-h-0 flex-1 grid-cols-3 grid-rows-3 gap-[7px]"
    >
      {emptyMessage ? (
        <>
          <div className="col-span-3 row-span-2 flex flex-col items-center justify-center gap-3 rounded-tile bg-keylime p-6 text-center">
            {emptyMessage}
          </div>
          <div className="col-span-2" aria-hidden="true" />
          {slots[8] && slots[8].kind !== 'word' && <NavTile slot={slots[8]} category={category} onNav={onNav} />}
        </>
      ) : (
        slots.map((slot, i) => {
          const key = `${category.id}-${i}`;
          if (!slot) return <div key={key} aria-hidden="true" />;
          if (slot.kind !== 'word') return <NavTile key={key} slot={slot} category={category} onNav={onNav} />;
          const { word } = slot;
          return (
            <Tile
              key={`${key}-${word.label}`}
              label={word.label}
              icon={word.icon}
              photo={word.photo}
              color={word.color ?? category.color}
              variant={variant}
              onClick={() => onTile(word.label)}
            />
          );
        })
      )}
    </div>
  );
}
