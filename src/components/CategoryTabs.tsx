import type { Category, CategoryId } from '../data/vocabulary';
import { useI18n } from '../lib/i18n';
import { FitText } from './FitText';

interface CategoryTabsProps {
  categories: Category[];
  current: CategoryId;
  onSelect: (id: CategoryId) => void;
}

/** Equal-width tabs that always fit the screen. Selection changes fill, never size. */
export function CategoryTabs({ categories, current, onSelect }: CategoryTabsProps) {
  const { t } = useI18n();
  return (
    <div
      className="grid gap-0.5 rounded-full bg-hairline p-1"
      style={{ gridTemplateColumns: `repeat(${categories.length}, minmax(0, 1fr))` }}
      role="tablist"
      aria-label={t('message', 'word-categories')}
    >
      {categories.map(({ id, icon: Icon }) => {
        const selected = id === current;
        const fullName = t('categories', id);
        const label = t('tabs', id);
        return (
          <button
            key={id}
            type="button"
            role="tab"
            id={`tab-${id}`}
            aria-selected={selected}
            aria-label={fullName}
            aria-controls="tile-grid"
            onClick={() => onSelect(id)}
            className={`flex h-[50px] min-w-0 flex-col items-center justify-center gap-px overflow-hidden rounded-full text-xs font-semibold roomy:h-[62px] roomy:text-sm ${
              selected ? 'bg-forest text-cream' : 'text-forest'
            }`}
          >
            <Icon size={18} aria-hidden="true" />
            <FitText minSize={11} className="max-w-full truncate px-0.5 max-[359px]:tracking-tight">{label}</FitText>
          </button>
        );
      })}
    </div>
  );
}
