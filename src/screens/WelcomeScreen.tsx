import { ArrowRight, Droplet, Hand, Utensils, Volume2 } from 'lucide-react';
import { SproutIllustration } from '../components/SproutIllustration';
import { Wordmark } from '../components/Wordmark';
import { useI18n } from '../lib/i18n';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const { t } = useI18n();
  const hour = new Date().getHours();
  const greeting = hour >= 5 && hour < 12 ? t('greeting', 'morning') : hour >= 12 && hour < 18 ? t('greeting', 'afternoon') : t('greeting', 'evening');

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-[14px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(21px,env(safe-area-inset-bottom))]">
      <header className="flex min-h-11 items-center justify-between">
        <Wordmark className="h-[30px] w-auto text-forest" />
        <span className="rounded-full bg-keylime px-3 py-1.5 text-[13px] text-forest" aria-live="polite">
          {greeting}
        </span>
      </header>

      <section className="flex flex-col gap-[14px] rounded-tile bg-keylime px-[21px] py-7">
        <div className="flex items-start justify-between gap-3">
          <span className="eyebrow pt-1 text-forest">{t('welcome', 'eyebrow')}</span>
          <SproutIllustration className="-mt-3 -mr-2 size-24 shrink-0" />
        </div>
        <h1 className="font-display text-title leading-[1.05] font-light tracking-[-0.03em] text-balance text-forest">
          {t('welcome', 'headline')}
        </h1>
        <p>{t('welcome', 'body')}</p>
      </section>

      <div className="rounded-tile bg-slate p-[21px]" aria-hidden="true">
        <div className="flex flex-col gap-[9px] rounded-[10px] bg-cream p-[14px]">
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
              <span
                key={label}
                className="flex h-[46px] flex-col items-center justify-center gap-0.5 rounded-lg bg-sage text-[11px] font-semibold text-forest"
              >
                <Icon size={16} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="pressable mt-auto flex h-14 shrink-0 items-center justify-center gap-[9px] rounded-tile bg-forest text-[17px] font-medium text-cream hover:bg-forest-deep"
      >
        {t('welcome', 'start')}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </main>
  );
}
