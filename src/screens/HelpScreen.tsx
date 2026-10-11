import type { LucideIcon } from 'lucide-react';
import { Activity, LifeBuoy, Phone, Pill, RotateCw, Stethoscope, Wind, X, Zap } from 'lucide-react';
import { useState } from 'react';

type Urgency = 'critical' | 'urgent' | 'medical';

const HELP_PHRASES: { label: string; icon: LucideIcon; urgency: Urgency }[] = [
  { label: 'I need help', icon: LifeBuoy, urgency: 'critical' },
  { label: 'Call 911 for me', icon: Phone, urgency: 'critical' },
  { label: "Can't breathe", icon: Wind, urgency: 'critical' },
  { label: 'Chest pain', icon: Activity, urgency: 'critical' },
  { label: 'It hurts', icon: Zap, urgency: 'urgent' },
  { label: 'Dizzy', icon: RotateCw, urgency: 'urgent' },
  { label: 'Medicine', icon: Pill, urgency: 'medical' },
  { label: 'Doctor', icon: Stethoscope, urgency: 'medical' },
];

const URGENCY_CLASS: Record<Urgency, string> = {
  critical: 'bg-help-wash text-help-ink',
  urgent: 'bg-slate text-forest',
  medical: 'bg-mint text-forest',
};

interface HelpScreenProps {
  onSpeak: (text: string) => void;
  onClose: () => void;
}

/** The only screen where red is allowed. Every tile speaks immediately: no message building in an emergency. */
export function HelpScreen({ onSpeak, onClose }: HelpScreenProps) {
  const [lastSaid, setLastSaid] = useState<string | null>(null);

  const say = (text: string) => {
    onSpeak(text);
    setLastSaid(text);
  };

  return (
    <main className="mx-auto flex h-full max-w-2xl flex-col gap-[11px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(14px,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-title leading-none font-light tracking-[-0.02em] text-help-ink">Help</h1>
        <button
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full bg-hairline text-forest"
          aria-label="Close help and return to the board"
        >
          <X size={22} aria-hidden="true" />
        </button>
      </header>

      <div className="flex min-h-[52px] items-baseline gap-[9px] rounded-tile bg-keylime p-[14px]" aria-live="polite">
        <span className="eyebrow text-muted">You said</span>
        <b className="text-message text-forest">{lastSaid ?? 'Tap a phrase to say it'}</b>
      </div>

      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-[7px]">
        {HELP_PHRASES.map(({ label, icon: Icon, urgency }) => (
          <button
            key={label}
            type="button"
            onClick={() => say(label)}
            className={`pressable flex flex-col items-center justify-center gap-1.5 rounded-tile p-[7px] text-center text-tile leading-tight font-semibold ${URGENCY_CLASS[urgency]}`}
          >
            <Icon size={26} aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>

      {/* Honest copy: contact alerts don't exist yet, so the screen says so instead of faking it. */}
      <p className="rounded-tile bg-hairline px-[14px] py-[11px] text-center text-sm leading-snug text-charcoal">
        Contact alerts are coming soon. Show this screen to someone nearby.
        <br />
        In a life-threatening emergency, call 911.
      </p>
    </main>
  );
}
