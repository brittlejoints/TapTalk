import { ArrowLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import type { ReactNode } from 'react';
import { TILE_COLOR_CLASS } from '../data/colors';
import { TILE_ICONS } from '../data/icons';
import { CATEGORIES } from '../data/vocabulary';
import type { CustomTile } from '../lib/customTiles';
import type { Settings } from '../lib/settings';

interface SettingsScreenProps {
  settings: Settings;
  voices: SpeechSynthesisVoice[];
  speechSupported: boolean;
  savedPhrases: string[];
  customTiles: CustomTile[];
  onAddTile: () => void;
  onEditTile: (id: string) => void;
  onUpdate: (patch: Partial<Settings>) => void;
  onTestVoice: () => void;
  onRemovePhrase: (phrase: string) => void;
  onBack: () => void;
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-[14px] rounded-tile bg-keylime p-[21px]">
      <h2 className="eyebrow text-forest">{title}</h2>
      {children}
    </section>
  );
}

function Toggle({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-center justify-between gap-[14px]">
      <span className="flex flex-col">
        <span className="font-semibold text-forest">{label}</span>
        <span className="text-sm text-muted">{hint}</span>
      </span>
      <input
        id={id}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="relative h-[30px] w-[50px] shrink-0 cursor-pointer appearance-none rounded-full bg-cream transition-colors after:absolute after:top-[3px] after:left-[3px] after:size-6 after:rounded-full after:bg-muted after:transition-transform checked:bg-forest checked:after:translate-x-5 checked:after:bg-cream"
      />
    </label>
  );
}

export function SettingsScreen({
  settings,
  voices,
  speechSupported,
  savedPhrases,
  customTiles,
  onAddTile,
  onEditTile,
  onUpdate,
  onTestVoice,
  onRemovePhrase,
  onBack,
}: SettingsScreenProps) {
  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-[14px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="grid size-11 place-items-center rounded-full bg-hairline text-forest"
          aria-label="Back to the board"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="font-display text-title leading-none font-light tracking-[-0.02em] text-forest">Settings</h1>
      </header>

      <Section title="Your tiles">
        <button
          type="button"
          onClick={onAddTile}
          className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-forest font-medium text-cream"
        >
          <Plus size={20} aria-hidden="true" />
          Add a tile
        </button>
        {customTiles.length === 0 ? (
          <p className="text-sm text-muted">
            Add words that matter to you, like names, favorite foods or places, with a photo or an icon.
          </p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {customTiles.map((t) => {
              const Icon = TILE_ICONS[t.icon];
              const categoryLabel = CATEGORIES.find((c) => c.id === t.category)?.label;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => onEditTile(t.id)}
                    className="flex w-full items-center gap-3 rounded-tile bg-cream p-1.5 pr-3 text-left"
                    aria-label={`Edit tile: ${t.label}, in ${categoryLabel}`}
                  >
                    <span className={`tile-edge grid size-11 shrink-0 place-items-center overflow-hidden rounded-[10px] text-forest ${TILE_COLOR_CLASS[t.color]}`}>
                      {t.photo ? <img src={t.photo} alt="" className="size-full object-cover" /> : <Icon size={20} aria-hidden="true" />}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold text-forest">{t.label}</span>
                      <span className="text-sm text-muted">{categoryLabel}</span>
                    </span>
                    <ChevronRight size={18} className="text-muted" aria-hidden="true" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </Section>

      <Section title="Talking">
        <Toggle
          id="speak-on-tap"
          label="Speak each tile when tapped"
          hint="Says each word right away, as well as adding it to the message."
          checked={settings.speakOnTap}
          onChange={(speakOnTap) => onUpdate({ speakOnTap })}
        />
      </Section>

      <Section title="Seeing">
        <Toggle
          id="high-visibility"
          label="High-visibility tiles"
          hint="Adds a dark outline to every tile and button."
          checked={settings.highVisibility}
          onChange={(highVisibility) => onUpdate({ highVisibility })}
        />
      </Section>

      <Section title="Voice">
        {speechSupported ? (
          <>
            <label htmlFor="voice" className="flex flex-col gap-1.5">
              <span className="font-semibold text-forest">Voice</span>
              <select
                id="voice"
                value={settings.voiceURI ?? ''}
                onChange={(e) => onUpdate({ voiceURI: e.target.value || null })}
                className="h-12 rounded-tile bg-cream px-3 text-charcoal"
              >
                <option value="">Device default</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="rate" className="flex flex-col gap-1.5">
              <span className="font-semibold text-forest">Speed: {settings.rate.toFixed(1)}×</span>
              <input
                id="rate"
                type="range"
                min={0.5}
                max={1.5}
                step={0.1}
                value={settings.rate}
                onChange={(e) => onUpdate({ rate: Number(e.target.value) })}
                className="accent-forest"
              />
            </label>
            <button
              type="button"
              onClick={onTestVoice}
              className="pressable h-12 rounded-tile bg-forest font-medium text-cream"
            >
              Test voice
            </button>
          </>
        ) : (
          <p>This browser can't speak out loud. Try Safari, Chrome or Edge.</p>
        )}
      </Section>

      <Section title="Saved phrases">
        {savedPhrases.length === 0 ? (
          <p className="text-muted">Build a message on the board and tap the star to save it.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {savedPhrases.map((phrase) => (
              <li key={phrase} className="flex items-center justify-between gap-2 rounded-tile bg-cream py-1 pr-1 pl-[14px]">
                <span className="min-w-0 text-forest">{phrase}</span>
                <button
                  type="button"
                  onClick={() => onRemovePhrase(phrase)}
                  className="grid size-11 shrink-0 place-items-center rounded-md text-muted"
                  aria-label={`Remove saved phrase: ${phrase}`}
                >
                  <Trash2 size={18} aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </main>
  );
}
