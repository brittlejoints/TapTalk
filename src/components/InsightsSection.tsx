import { useState } from 'react';
import { useI18n } from '../lib/i18n';
import { COUNTERS, loadInsights, previewReport, setOptIn, type Snapshot } from '../lib/insights';

/**
 * "Help improve Tap Talk": the opt-in switch, and a plain list of exactly what
 * the weekly report holds, so people can see it before and after they decide.
 */
export function InsightsSection({ snapshot }: { snapshot: Snapshot }) {
  const { t } = useI18n();
  const [optIn, setOn] = useState(() => loadInsights().optIn);
  const [open, setOpen] = useState(false);
  const report = open ? previewReport(snapshot) : null;
  const counted = report ? COUNTERS.filter((c) => report.counts[c] > 0) : [];

  return (
    <>
      <label htmlFor="share-insights" className="flex cursor-pointer items-center justify-between gap-[14px]">
        <span className="flex flex-col">
          <span className="font-semibold text-forest">{t('insights', 'toggle')}</span>
          <span className="text-sm text-muted">{t('insights', 'hint')}</span>
        </span>
        <input
          id="share-insights"
          type="checkbox"
          role="switch"
          checked={optIn}
          onChange={(e) => setOn(setOptIn(e.target.checked).optIn)}
          className="relative h-[30px] w-[50px] shrink-0 cursor-pointer appearance-none rounded-full bg-cream transition-colors after:absolute after:top-[3px] after:left-[3px] after:size-6 after:rounded-full after:bg-muted after:transition-transform checked:bg-forest checked:after:translate-x-5 checked:after:bg-cream"
        />
      </label>
      <details open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)} className="rounded-tile bg-cream px-[14px]">
        <summary className="flex min-h-11 cursor-pointer items-center font-semibold text-forest">{t('insights', 'see')}</summary>
        {report && (
          <div className="flex flex-col gap-2 pb-[14px] text-sm text-charcoal">
            <p className="font-semibold text-forest">{t('insights', 'this-week')}</p>
            {counted.length === 0 ? (
              <p className="text-muted">{t('insights', 'nothing-yet')}</p>
            ) : (
              <ul className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5">
                {counted.map((c) => (
                  <li key={c} className="contents">
                    <span>{t('insights', c)}</span>
                    <span className="text-right font-semibold tabular-nums text-forest">{report.counts[c]}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="text-muted">{t('insights', 'also')}</p>
          </div>
        )}
      </details>
    </>
  );
}
