import { ArrowLeft, ArrowRight, Droplet, Hand, Utensils, Volume2 } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  DayGlyphIllustration,
  LifeRingIllustration,
  SeedPacketIllustration,
  SproutIllustration,
  TapSpeakIllustration,
} from '../components/illustrations';
import { Wordmark } from '../components/Wordmark';
import { periodFor } from '../lib/greeting';
import { useI18n } from '../lib/i18n';

const STEPS = 4;

/** The first-launch guide: four short steps, each with its own illustration. Skip is always one tap. */
export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const [step, setStep] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const period = periodFor(new Date().getHours());
  const last = step === STEPS - 1;

  // Move focus to the new step's heading so screen readers announce it.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    heading.current?.focus();
  }, [step]);

  const copy =
    step === 0
      ? { eyebrow: t('welcome', 'eyebrow'), title: t('welcome', 'headline'), body: t('welcome', 'body') }
      : {
          eyebrow: t('onboarding', `s${step + 1}-eyebrow` as 's2-eyebrow'),
          title: t('onboarding', `s${step + 1}-title` as 's2-title'),
          body: t('onboarding', `s${step + 1}-body` as 's2-body'),
        };

  // Remounting the picture on each step lets its leaves grow in once (only with playful touches on).
  const picture: ReactNode = [
    <MockBoard key="board" />,
    <TapSpeakIllustration key="tap" className="size-40 min-[390px]:size-44 roomy:size-64" />,
    <LifeRingIllustration key="ring" className="size-40 min-[390px]:size-44 roomy:size-64" />,
    <SeedPacketIllustration key="seed" className="size-40 min-[390px]:size-44 roomy:size-64" />,
  ][step];

  return (
    <main className="mx-auto flex min-h-full max-w-lg roomy:max-w-2xl flex-col gap-[14px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(21px,env(safe-area-inset-bottom))]">
      <header className="flex min-h-11 items-center justify-between gap-2">
        <Wordmark className="h-[30px] w-auto text-forest" draw />
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-keylime py-1.5 pr-3 pl-2 text-[13px] text-forest">
            <DayGlyphIllustration period={period} className="size-5 shrink-0" />
            {t('greeting', period)}
          </span>
          {!last && (
            <button type="button" onClick={onStart} className="h-11 rounded-full px-3 text-sm font-semibold text-forest underline underline-offset-4">
              {t('onboarding', 'skip')}
            </button>
          )}
        </div>
      </header>

      <section className="flex flex-col gap-[14px] rounded-tile bg-keylime px-[21px] py-7">
        <div className="flex items-start justify-between gap-3">
          <span className="eyebrow pt-1 text-forest">{copy.eyebrow}</span>
          {step === 0 && <SproutIllustration className="-mt-3 -mr-2 size-24 shrink-0" />}
        </div>
        <h1
          ref={heading}
          tabIndex={-1}
          className="font-display text-title leading-[1.05] font-light tracking-[-0.03em] text-balance text-forest outline-none"
        >
          {copy.title}
        </h1>
        <p>{copy.body}</p>
      </section>

      <div className="flex flex-1 items-center justify-center rounded-tile bg-slate p-[21px]" aria-hidden="true">
        {picture}
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <p className="sr-only" aria-live="polite">
          {t('onboarding', 'step-of').replace('{n}', String(step + 1)).replace('{total}', String(STEPS))}
        </p>
        <div className="flex justify-center gap-2" aria-hidden="true">
          {Array.from({ length: STEPS }, (_, i) => (
            <span key={i} className={`size-2.5 rounded-full ${i === step ? 'bg-forest' : 'bg-hairline'}`} />
          ))}
        </div>
        <div className={`grid gap-2 ${step > 0 ? 'grid-cols-[1fr_2fr]' : ''}`}>
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="pressable flex h-14 items-center justify-center gap-2 rounded-tile bg-hairline text-[17px] font-medium text-forest"
            >
              <ArrowLeft size={18} aria-hidden="true" />
              {t('onboarding', 'back')}
            </button>
          )}
          <button
            type="button"
            onClick={() => (last ? onStart() : setStep(step + 1))}
            className="pressable flex h-14 items-center justify-center gap-[9px] rounded-tile bg-forest text-[17px] font-medium text-cream hover:bg-forest-deep"
          >
            {last ? t('welcome', 'start') : t('onboarding', 'next')}
            <ArrowRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
}

/** A tiny picture of the board: a message and three tiles. */
function MockBoard() {
  const { t } = useI18n();
  return (
    <div className="flex w-full flex-col gap-[9px] rounded-[10px] bg-cream p-[14px]">
      <div className="flex items-center justify-between rounded-[9px] bg-keylime px-[11px] py-[9px] text-[15px] font-semibold text-forest">
        {`${t('needs', 'i-want')} ${t('needs', 'water').toLowerCase()}`}
        <span className="grid size-[30px] place-items-center rounded-lg bg-forest text-cream">
          <Volume2 size={16} />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: t('needs', 'i-want'), Icon: Hand },
          { label: t('needs', 'water'), Icon: Droplet },
          { label: t('needs', 'food'), Icon: Utensils },
        ].map(({ label, Icon }) => (
          <span key={label} className="flex h-[46px] flex-col items-center justify-center gap-0.5 rounded-lg bg-sage text-[11px] font-semibold text-forest">
            <Icon size={16} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
