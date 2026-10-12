import { Check, MessageCircle, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { TILE_COLORS, TILE_COLOR_CLASS, type TileColorId } from '../data/colors';
import { CORE_WORD_IDS, CORE_WORD_INFO } from '../data/coreWords';
import { DEFAULT_CORE_SLOTS, MAX_CORE_LABEL_LENGTH, withCoreSlot, type CoreSlot, type CoreSlots } from '../lib/coreWords';
import { useI18n } from '../lib/i18n';

function slotLabel(slot: CoreSlot, t: ReturnType<typeof useI18n>['t']) {
  return slot.kind === 'builtin' ? t('core', slot.id) : slot.label;
}

/** Edit the four quick words. Slots can be changed but never added or removed. */
export function CoreWordsEditor({ slots, onChange }: { slots: CoreSlots; onChange: (slots: CoreSlots) => void }) {
  const { t } = useI18n();
  const [index, setIndex] = useState(0);
  const current = slots[index];
  const [ownWord, setOwnWord] = useState('');
  const [ownColor, setOwnColor] = useState<TileColorId>('sand');

  const choose = (slot: CoreSlot) => onChange(withCoreSlot(slots, index, slot));
  const pickSlot = (i: number) => {
    setIndex(i);
    const next = slots[i];
    setOwnWord(next.kind === 'custom' ? next.label : '');
    setOwnColor(next.kind === 'custom' ? next.color : 'sand');
  };
  const ownLabel = ownWord.trim();
  const isDefault = JSON.stringify(slots) === JSON.stringify(DEFAULT_CORE_SLOTS);

  return (
    <div className="flex flex-col gap-[14px]">
      <div className="grid grid-cols-4 gap-[7px]" role="radiogroup" aria-label={t('settings', 'quick-words')}>
        {slots.map((slot, i) => {
          const selected = i === index;
          const color = slot.kind === 'builtin' ? CORE_WORD_INFO[slot.id].color : slot.color;
          return (
            <button
              key={i}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${t('settings', 'quick-word-slot').replace('{n}', String(i + 1))}: ${slotLabel(slot, t)}`}
              onClick={() => pickSlot(i)}
              className={`tile-edge flex h-13 min-w-0 items-center justify-center rounded-tile px-1 text-[15px] font-semibold text-forest ${TILE_COLOR_CLASS[color]} ${selected ? 'outline-3 outline-offset-2 outline-forest' : ''}`}
            >
              <span className="truncate">{slotLabel(slot, t)}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-1.5 min-[360px]:grid-cols-3" role="group" aria-label={t('settings', 'quick-word-slot').replace('{n}', String(index + 1))}>
        {CORE_WORD_IDS.map((id) => {
          const { icon: Icon } = CORE_WORD_INFO[id];
          const selected = current.kind === 'builtin' && current.id === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                choose({ kind: 'builtin', id });
                setOwnWord('');
              }}
              className={`flex min-h-12 items-center justify-center gap-1.5 rounded-tile px-2 font-semibold ${selected ? 'bg-forest text-cream' : 'bg-cream text-forest'}`}
            >
              <Icon size={18} aria-hidden="true" />
              <span className="truncate">{t('core', id)}</span>
              {selected && <Check size={16} aria-hidden="true" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2 rounded-tile bg-cream p-3">
        <label htmlFor="own-quick-word" className="font-semibold text-forest">{t('settings', 'quick-word-own')}</label>
        <input
          id="own-quick-word"
          value={ownWord}
          maxLength={MAX_CORE_LABEL_LENGTH}
          onChange={(e) => setOwnWord(e.target.value)}
          placeholder={t('settings', 'quick-word-own-placeholder')}
          autoComplete="off"
          className="h-12 rounded-tile bg-keylime px-3.5 text-[17px] text-charcoal placeholder:text-muted"
        />
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label={t('settings', 'quick-word-color')}>
          {TILE_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              role="radio"
              aria-checked={ownColor === c.id}
              aria-label={c.label}
              onClick={() => setOwnColor(c.id)}
              className={`tile-edge grid size-11 place-items-center rounded-full text-forest ${TILE_COLOR_CLASS[c.id]}`}
            >
              {ownColor === c.id && <Check size={18} aria-hidden="true" />}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={!ownLabel}
          onClick={() => choose({ kind: 'custom', label: ownLabel, color: ownColor })}
          className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-forest font-medium text-cream disabled:bg-hairline disabled:text-muted"
        >
          <MessageCircle size={18} aria-hidden="true" />
          {t('settings', 'quick-word-use')}
        </button>
      </div>

      <button
        type="button"
        disabled={isDefault}
        onClick={() => {
          onChange(DEFAULT_CORE_SLOTS);
          setOwnWord('');
          setOwnColor('sand');
        }}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-cream font-medium text-forest disabled:text-muted"
      >
        <RotateCcw size={18} aria-hidden="true" />
        {t('settings', 'quick-words-reset')}
      </button>
    </div>
  );
}
