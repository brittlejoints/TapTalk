import { MessageCircle } from 'lucide-react';
import { TILE_COLOR_CLASS } from '../data/colors';
import { CORE_WORD_INFO } from '../data/coreWords';
import type { CoreSlots } from '../lib/coreWords';
import { useI18n } from '../lib/i18n';

/** Quick words stay in the same place on every page so users build motor memory. There are always four. */
export function CoreRow({ slots, onWord }: { slots: CoreSlots; onWord: (word: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-4 gap-[7px]" role="group" aria-label="Core words">
      {slots.map((slot, i) => {
        const label = slot.kind === 'builtin' ? t('core', slot.id) : slot.label;
        const Icon = slot.kind === 'builtin' ? CORE_WORD_INFO[slot.id].icon : MessageCircle;
        const color = slot.kind === 'builtin' ? CORE_WORD_INFO[slot.id].color : slot.color;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onWord(label)}
            className={`pressable tile-edge core-label flex h-13 min-w-0 items-center justify-center gap-1.5 rounded-tile px-1 font-semibold text-[16px] text-forest ${TILE_COLOR_CLASS[color]}`}
          >
            <Icon size={18} aria-hidden="true" className="hidden shrink-0 min-[360px]:block" />
            <span className="truncate">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
