import type { LucideIcon } from 'lucide-react';
import {
  Activity, Copy, LifeBuoy, MapPin, MessageSquare, Phone, Pill, RotateCw, Send, Stethoscope, Wind, X, Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { buildAlertMessage, buildSmsUrl, detectPlatform, getLocation } from '../lib/alert';
import { FitText } from '../components/FitText';
import { TwoBubblesIllustration } from '../components/illustrations';
import { useI18n } from '../lib/i18n';
import { record } from '../lib/insights';
import type { EmergencyContact } from '../lib/contacts';

type Urgency = 'critical' | 'urgent' | 'medical';

const HELP_PHRASES: { key: 'i-need-help' | 'call-911' | 'cant-breathe' | 'chest-pain' | 'it-hurts' | 'dizzy' | 'medicine' | 'doctor'; icon: LucideIcon; urgency: Urgency }[] = [
  { key: 'i-need-help', icon: LifeBuoy, urgency: 'critical' },
  { key: 'call-911', icon: Phone, urgency: 'critical' },
  { key: 'cant-breathe', icon: Wind, urgency: 'critical' },
  { key: 'chest-pain', icon: Activity, urgency: 'critical' },
  { key: 'it-hurts', icon: Zap, urgency: 'urgent' },
  { key: 'dizzy', icon: RotateCw, urgency: 'urgent' },
  { key: 'medicine', icon: Pill, urgency: 'medical' },
  { key: 'doctor', icon: Stethoscope, urgency: 'medical' },
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
  const { t } = useI18n();
  const [lastSaid, setLastSaid] = useState<string | null>(null);
  const [step, setStep] = useState<AlertStep>('closed');
  const [includeLocation, setIncludeLocation] = useState(true);
  const [alertText, setAlertText] = useState('');
  const [copied, setCopied] = useState(false);
  const locateRun = useRef(0);
  const pageRef = useRef<HTMLElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const alertButtonRef = useRef<HTMLButtonElement>(null);
  const sheetOpen = step !== 'closed';
  const wasOpen = useRef(false);

  const say = (text: string) => {
    record('helpPhrasesSpoken');
    onSpeak(text);
    setLastSaid(text);
  };

  const openMessages = (location: Awaited<ReturnType<typeof getLocation>>) => {
    record('alertsStarted');
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

  // While the sheet is open everything behind it is inert, so Tab and screen
  // reader swipes stay inside the sheet. Closing it returns focus to the button
  // that opened it.
  useEffect(() => {
    for (const el of Array.from(pageRef.current?.children ?? [])) {
      if (el !== sheetRef.current) (el as HTMLElement).inert = sheetOpen;
    }
    if (wasOpen.current && !sheetOpen) alertButtonRef.current?.focus();
    wasOpen.current = sheetOpen;
  }, [sheetOpen]);

  const names = contacts.map((c) => c.name).join(', ');

  return (
    <main ref={pageRef} className="mx-auto flex h-full max-w-2xl flex-col gap-[11px] roomy:max-w-5xl roomy:gap-3.5 side:grid side:max-w-[1440px] side:grid-cols-2 side:grid-rows-[auto_auto_auto_auto_minmax(0,1fr)] roomy:side:grid-rows-[auto_minmax(0,1fr)_auto_auto] side:gap-x-3 side:gap-y-[7px] roomy:side:gap-x-5 roomy:side:gap-y-3 px-3.5 roomy:px-6 pt-[max(11px,env(safe-area-inset-top))] pb-[max(14px,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between">
        <h1 className="font-display text-title leading-none font-light tracking-[-0.02em] text-help-ink short:text-[28px]">{t('help', 'title')}</h1>
        <button
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full bg-hairline text-forest"
          aria-label={t('help', 'close')}
        >
          <X size={22} aria-hidden="true" />
        </button>
      </header>

      <div className="flex min-h-[52px] items-baseline gap-[9px] rounded-tile bg-keylime p-[14px] roomy:side:flex-col roomy:side:gap-2 roomy:side:p-5" aria-live="polite">
        <span className="eyebrow text-muted short:hidden">{t('help', 'you-said')}</span>
        <b className="text-message text-forest roomy:text-[24px] roomy:side:text-[36px] roomy:side:leading-tight short:text-base">{lastSaid ?? t('help', 'tap-a-phrase')}</b>
      </div>

      <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-2 gap-[7px] roomy:gap-3 side:col-start-2 side:row-span-5 side:row-start-1">
        {HELP_PHRASES.map(({ key, icon: Icon, urgency }) => {
          const label = t('help', key);
          return (
          <button
            key={key}
            type="button"
            onClick={() => say(label)}
            className={`pressable flex flex-col items-center justify-center gap-1.5 rounded-tile p-[7px] text-center [@media(max-height:640px)]:flex-row [@media(max-height:640px)]:gap-2 text-tile leading-tight font-semibold ${URGENCY_CLASS[urgency]}`}
          >
            <Icon size={26} aria-hidden="true" className="shrink-0 roomy:size-10 [@media(max-height:640px)]:size-5" />
            <FitText className="max-w-full min-w-0 overflow-hidden">{label}</FitText>
          </button>
          );
        })}
      </div>

      {contacts.length > 0 ? (
        <button
          type="button"
          ref={alertButtonRef}
          onClick={() => setStep('confirm')}
          className="pressable flex h-14 shrink-0 items-center justify-center gap-[9px] rounded-tile bg-help text-[17px] font-semibold text-cream"
        >
          <Send size={18} aria-hidden="true" />
          {t('help', 'alert-contacts')}
        </button>
      ) : (
        <div className="flex shrink-0 items-center gap-3 rounded-tile bg-keylime p-[11px] pl-[14px] short:flex-col short:items-stretch short:gap-2">
          <TwoBubblesIllustration className="size-14 shrink-0 max-[359px]:hidden short:hidden" />
          <p className="min-w-0 flex-1 text-sm leading-snug text-charcoal">{t('help', 'no-contacts')}</p>
          <button
            type="button"
            onClick={onSetUpContacts}
            className="h-11 shrink-0 rounded-tile bg-forest px-4 text-sm font-medium text-cream"
          >
            {t('help', 'add-contacts')}
          </button>
        </div>
      )}
      <p className="shrink-0 text-center text-[13px] text-muted">{t('help', 'note')}</p>

      {sheetOpen && (
        <div ref={sheetRef} className="fixed inset-0 z-10 flex items-end justify-center bg-charcoal/40" onClick={() => step !== 'locating' && setStep('closed')}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-title"
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-full w-full max-w-2xl flex-col gap-[14px] overflow-y-auto rounded-t-[22px] bg-cream px-[21px] pt-[21px] pb-[max(21px,env(safe-area-inset-bottom))]"
          >
            {step === 'confirm' && (
              <>
                <h2 id="alert-title" className="font-display text-[34px] leading-tight font-light text-help-ink">
                  {t('help', 'confirm-title')}
                </h2>
                <p>
                  {t('help', 'confirm-body')
                    .split('{names}')
                    .flatMap((part, i, all) => (i < all.length - 1 ? [part, <b key={i} className="text-forest">{names}</b>] : [part]))}
                </p>
                <label htmlFor="include-location" className="flex cursor-pointer items-center justify-between gap-3 rounded-tile bg-keylime p-[14px]">
                  <span className="flex items-center gap-2 font-semibold text-forest">
                    <MapPin size={20} aria-hidden="true" />
                    {t('help', 'include-location')}
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
                    {t('help', 'cancel')}
                  </button>
                  <button
                    type="button"
                    onClick={() => void sendAlert()}
                    className="pressable flex h-14 items-center justify-center gap-2 rounded-tile bg-help font-semibold text-cream"
                  >
                    <MessageSquare size={18} aria-hidden="true" />
                    {t('help', 'open-messages')}
                  </button>
                </div>
              </>
            )}

            {step === 'locating' && (
              <>
                <h2 id="alert-title" className="font-display text-[34px] leading-tight font-light text-help-ink" aria-live="polite">
                  {t('help', 'locating-title')}
                </h2>
                <p>{t('help', 'locating-body')}</p>
                <button type="button" onClick={skipLocation} className="h-14 rounded-tile bg-forest font-medium text-cream" autoFocus>
                  {t('help', 'skip-location')}
                </button>
              </>
            )}

            {step === 'opened' && (
              <>
                <h2 id="alert-title" className="font-display text-[34px] leading-tight font-light text-forest">
                  {t('help', 'tap-send')}
                </h2>
                <p role="status">
                  {t('help', 'opened-body')}
                </p>
                <div className="flex flex-col gap-2 rounded-tile bg-keylime p-[14px]">
                  <span className="eyebrow text-forest">{t('help', 'messages-didnt-open')}</span>
                  <div className="grid grid-cols-2 gap-2">
                    {contacts.map((c) => (
                      <a
                        key={c.id}
                        href={`tel:${c.phone}`}
                        className="pressable flex h-12 min-w-0 items-center justify-center gap-2 rounded-tile bg-forest px-2 font-medium text-cream"
                      >
                        <Phone size={18} aria-hidden="true" className="shrink-0" />
                        <span className="truncate">{t('help', 'call-contact')} {c.name}</span>
                      </a>
                    ))}
                  </div>
                  <button type="button" onClick={() => void copyAlert()} className="flex h-12 items-center justify-center gap-2 rounded-tile bg-cream font-medium text-forest">
                    <Copy size={18} aria-hidden="true" />
                    {copied ? t('help', 'copied') : t('help', 'copy-alert')}
                  </button>
                </div>
                <button type="button" onClick={() => setStep('closed')} className="h-12 rounded-tile bg-hairline font-medium text-forest" autoFocus>
                  {t('help', 'done')}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
