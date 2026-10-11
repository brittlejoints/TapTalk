import type { Category, CategoryId } from '../data/vocabulary';

interface CategoryTabsProps {
  categories: Category[];
  current: CategoryId;
  onSelect: (id: CategoryId) => void;
}

/** Equal-width tabs that always fit the screen. Selection changes fill, never size. */
export function CategoryTabs({ categories, current, onSelect }: CategoryTabsProps) {
  return (
    <div
      className="grid gap-0.5 rounded-full bg-hairline p-1"
      style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}
      role="tablist"
      aria-label="Word categories"
    >
      {categories.map(({ id, label, icon: Icon }) => {
        const selected = id === current;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={selected}
            aria-controls="tile-grid"
            onClick={() => onSelect(id)}
            className={`flex h-[50px] flex-col items-center justify-center gap-px rounded-full text-xs font-semibold ${
              selected ? 'bg-forest text-cream' : 'text-forest'
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
