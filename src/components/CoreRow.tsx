import type { LucideIcon } from 'lucide-react';
import { Check, Hand, Plus, X } from 'lucide-react';

/** Core words stay in the same place on every page so users build motor memory. */
const CORE_WORDS: { label: string; icon: LucideIcon; className: string }[] = [
  { label: 'Yes', icon: Check, className: 'bg-sage' },
  { label: 'No', icon: X, className: 'bg-slate' },
  { label: 'Stop', icon: Hand, className: 'bg-mint' },
  { label: 'More', icon: Plus, className: 'bg-mint' },
];

export function CoreRow({ onWord }: { onWord: (word: string) => void }) {
  return (
    <div className="grid grid-cols-4 gap-[7px]" role="group" aria-label="Core words">
      {CORE_WORDS.map(({ label, icon: Icon, className }) => (
        <button
          key={label}
          type="button"
          onClick={() => onWord(label)}
          className={`pressable flex h-13 items-center justify-center gap-1.5 rounded-tile font-semibold text-forest ${className}`}
        >
          <Icon size={18} aria-hidden="true" className="hidden min-[360px]:block" />
          {label}
        </button>
      ))}
    </div>
  );
}
