import { ArrowRight, Droplet, Hand, Utensils, Volume2 } from 'lucide-react';
import { SproutIllustration } from '../components/SproutIllustration';

export function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-[14px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(21px,env(safe-area-inset-bottom))]">
      <header className="flex min-h-11 items-center justify-between">
        <span className="font-display text-[27px] leading-none font-light text-forest">Tap Talk</span>
        <span className="rounded-full bg-keylime px-3 py-1.5 text-[13px] text-forest">Free · No account</span>
      </header>

      <section className="flex flex-col gap-[14px] rounded-tile bg-keylime px-[21px] py-7">
        <div className="flex items-start justify-between gap-3">
          <span className="eyebrow pt-1 text-forest">AAC for everyone</span>
          <SproutIllustration className="-mt-3 -mr-2 size-24 shrink-0" />
        </div>
        <h1 className="font-display text-title leading-[1.05] font-light tracking-[-0.03em] text-balance text-forest">
          Your voice, one tap away.
        </h1>
        <p>Build sentences with pictures and words, and Tap Talk says them out loud.</p>
      </section>

      {/* Product preview on the slate panel, as in the style reference */}
      <div className="rounded-tile bg-slate p-[21px]" aria-hidden="true">
        <div className="flex flex-col gap-[9px] rounded-[10px] bg-cream p-[14px]">
          <div className="flex items-center justify-between rounded-[9px] bg-keylime px-[11px] py-[9px] text-[15px] font-semibold text-forest">
            I want water
            <span className="grid size-[30px] place-items-center rounded-lg bg-forest text-cream">
              <Volume2 size={16} />
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: 'I want', Icon: Hand },
              { label: 'Water', Icon: Droplet },
              { label: 'Food', Icon: Utensils },
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
        Start talking
        <ArrowRight size={18} aria-hidden="true" />
      </button>
    </main>
  );
}
