import type { LucideIcon } from 'lucide-react';
import {
  Activity, Copy, LifeBuoy, MapPin, MessageSquare, Phone, Pill, RotateCw, Send, Stethoscope, Wind, X, Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { buildAlertMessage, buildSmsUrl, detectPlatform, getLocation } from '../lib/alert';
import type { EmergencyContact } from '../lib/contacts';

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
  urgent: 'bg-tile-mist text-forest tile-edge',
  medical: 'bg-tile-mint text-forest tile-edge',
};

type AlertStep = 'closed' | 'confirm' | 'locating' | 'opened';

interface HelpScreenProps {
  contacts: EmergencyContact[];
  yourName: string;
  onSpeak: (text: string) => void;
  onClose: () => void;
  onSetUpContacts: () => void;
}

/** The only screen where red is allowed. Every tile speaks immediately: no message building in an emergency. */
export function HelpScreen({ contacts, yourName, onSpeak, onClose, onSetUpContacts }: HelpScreenProps) {
  const [lastSaid, setLastSaid] = useState<string | null>(null);
  const [step, setStep] = useState<AlertStep>('closed');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [alertText, setAlertText] = useState('');
  const [copied, setCopied] = useState(false);
  const locateRun = useRef(0);

  const say = (text: string) => {
    onSpeak(text);
    setLastSaid(text);
  };

  const openMessages = (location: Awaited<ReturnType<typeof getLocation>>) => {
    const text = buildAlertMessage({ name: yourName, said: lastSaid, location });
    setAlertText(text);
    setStep('opened');
    window.location.href = buildSmsUrl(contacts.map((c) => c.phone), text, detectPlatform());
  };

  const sendAlert = async () => {
    if (!includeLocation) return openMessages(null);
    setStep('locating');
    const run = ++locateRun.current;
    const location = await getLocation();
    // Ignore a late result if the user already chose "Send without location".
    if (run === locateRun.current) openMessages(location);
  };

  const skipLocation = () => {
    locateRun.current++;
    openMessages(null);
  };

  const copyAlert = async () => {
    try {
      await navigator.clipboard.writeText(alertText);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  // Escape closes the sheet for keyboard and switch users.
  useEffect(() => {
    if (step === 'closed') return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setStep('closed');
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const names = contacts.map((c) => c.name).join(', ');

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

      {contacts.length > 0 ? (
        <button
          type="button"
          onClick={() => setStep('confirm')}
          className="pressable flex h-14 shrink-0 items-center justify-center gap-[9px] rounded-tile bg-help text-[17px] font-semibold text-cream"
        >
          <Send size={18} aria-hidden="true" />
          Alert my contacts
        </button>
      ) : (
        <div className="flex shrink-0 items-center justify-between gap-3 rounded-tile bg-hairline p-[11px] pl-[14px]">
          <p className="text-sm leading-snug text-charcoal">No emergency contacts yet.</p>
          <button
            type="button"
            onClick={onSetUpContacts}
            className="h-11 shrink-0 rounded-tile bg-forest px-4 text-sm font-medium text-cream"
          >
            Add contacts
          </button>
        </div>
      )}
      <p className="shrink-0 text-center text-[13px] text-muted">In a life-threatening emergency, call 911.</p>

      {step !== 'closed' && (
        <div className="fixed inset-0 z-10 flex items-end justify-center bg-charcoal/40" onClick={() => step !== 'locating' && setStep('closed')}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-title"
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-2xl flex-col gap-[14px] rounded-t-[22px] bg-cream px-[21px] pt-[21px] pb-[max(21px,env(safe-area-inset-bottom))]"
          >
            {step === 'confirm' && (
              <>
                <h2 id="alert-title" className="font-display text-[34px] leading-tight font-light text-help-ink">
                  Alert your contacts?
                </h2>
                <p>
                  Your messages app will open with an emergency message to <b className="text-forest">{names}</b>. You’ll
                  tap Send there.
                </p>
                <label htmlFor="include-location" className="flex cursor-pointer items-center justify-between gap-3 rounded-tile bg-keylime p-[14px]">
                  <span className="flex items-center gap-2 font-semibold text-forest">
                    <MapPin size={20} aria-hidden="true" />
                    Include my location
                  </span>
                  <input
                    id="include-location"
                    type="checkbox"
                    role="switch"
                    checked={includeLocation}
                    onChange={(e) => setIncludeLocation(e.target.checked)}
                    className="relative h-[30px] w-[50px] shrink-0 cursor-pointer appearance-none rounded-full bg-cream after:absolute after:top-[3px] after:left-[3px] after:size-6 after:rounded-full after:bg-muted after:transition-transform checked:bg-forest checked:after:translate-x-5 checked:after:bg-cream"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setStep('closed')} className="h-14 rounded-tile bg-hairline font-medium text-forest" autoFocus>
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => void sendAlert()}
                    className="pressable flex h-14 items-center justify-center gap-2 rounded-tile bg-help font-semibold text-cream"
                  >
                    <MessageSquare size={18} aria-hidden="true" />
                    Open Messages
                  </button>
                </div>
              </>
            )}

            {step === 'locating' && (
              <>
                <h2 id="alert-title" className="font-display text-[34px] leading-tight font-light text-help-ink" aria-live="polite">
                  Finding your location…
                </h2>
                <p>This can take a few seconds. Your phone may ask for permission.</p>
                <button type="button" onClick={skipLocation} className="h-14 rounded-tile bg-forest font-medium text-cream" autoFocus>
                  Send without location
                </button>
              </>
            )}

            {step === 'opened' && (
              <>
                <h2 id="alert-title" className="font-display text-[34px] leading-tight font-light text-forest">
                  Tap Send in Messages
                </h2>
                <p role="status">
                  Your messages app should be open with the alert ready. It isn’t sent until you tap Send there.
                </p>
                <div className="flex flex-col gap-2 rounded-tile bg-keylime p-[14px]">
                  <span className="eyebrow text-forest">If Messages didn’t open</span>
                  <div className="grid grid-cols-2 gap-2">
                    {contacts.map((c) => (
                      <a
                        key={c.id}
                        href={`tel:${c.phone}`}
                        className="pressable flex h-12 min-w-0 items-center justify-center gap-2 rounded-tile bg-forest px-2 font-medium text-cream"
                      >
                        <Phone size={18} aria-hidden="true" className="shrink-0" />
                        <span className="truncate">Call {c.name}</span>
                      </a>
                    ))}
                  </div>
                  <button type="button" onClick={() => void copyAlert()} className="flex h-12 items-center justify-center gap-2 rounded-tile bg-cream font-medium text-forest">
                    <Copy size={18} aria-hidden="true" />
                    {copied ? 'Copied. Paste it into any message.' : 'Copy alert text'}
                  </button>
                </div>
                <button type="button" onClick={() => setStep('closed')} className="h-12 rounded-tile bg-hairline font-medium text-forest" autoFocus>
                  Done
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
