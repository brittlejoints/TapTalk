import { Check, Hand, Plus, X, type LucideIcon } from 'lucide-react';
import { useI18n } from '../lib/i18n';

/** Core words stay in the same place on every page so users build motor memory. */
const CORE_WORDS: { key: 'yes' | 'no' | 'stop' | 'more'; icon: LucideIcon; className: string }[] = [
  { key: 'yes', icon: Check, className: 'bg-tile-mint' },
  { key: 'no', icon: X, className: 'bg-tile-mist' },
  { key: 'stop', icon: Hand, className: 'bg-tile-sand' },
  { key: 'more', icon: Plus, className: 'bg-tile-sand' },
];

export function CoreRow({ onWord }: { onWord: (word: string) => void }) {
  const { t } = useI18n();
  return (
    <div className="grid grid-cols-4 gap-[7px]" role="group" aria-label={t('message', 'core-words')}>
      {CORE_WORDS.map(({ key, icon: Icon, className }) => {
        const label = t('core', key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => onWord(label)}
            className={`pressable tile-edge core-label flex h-13 roomy:h-16 items-center justify-center gap-1.5 rounded-tile font-semibold text-[16px] text-forest ${className}`}
          >
            <Icon size={18} aria-hidden="true" className="hidden min-[360px]:block" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
