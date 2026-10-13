import { ArrowLeft, Check, ChevronRight, Phone, Plus, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { BackupSection } from '../components/BackupSection';
import { ContactForm } from '../components/ContactForm';
import { QuietBubbleIllustration, SeedPacketIllustration, WateringCanIllustration } from '../components/illustrations';
import { TILE_COLOR_CLASS } from '../data/colors';
import { iconFor } from '../data/icons';
import { LANGUAGES, type LanguageId } from '../data/strings';
import { CATEGORIES } from '../data/vocabulary';
import type { BackupData } from '../lib/backup';
import { MAX_CONTACTS, type EmergencyContact } from '../lib/contacts';
import type { CustomTile } from '../lib/customTiles';
import { useI18n } from '../lib/i18n';
import { TEXT_SIZES, type Settings, type TextSize } from '../lib/settings';

interface SettingsScreenProps {
  settings: Settings;
  voices: SpeechSynthesisVoice[];
  speechSupported: boolean;
  savedPhrases: string[];
  customTiles: CustomTile[];
  contacts: EmergencyContact[];
  onSaveContact: (contact: EmergencyContact) => boolean;
  onRemoveContact: (id: string) => void;
  onAddTile: () => void;
  onEditTile: (id: string) => void;
  onUpdate: (patch: Partial<Settings>) => void;
  onTestVoice: () => void;
  onRemovePhrase: (phrase: string) => void;
  onBack: () => void;
  /** App update state from the service worker. */
  updateReady: boolean;
  offlineReady: boolean;
  onApplyUpdate: () => void;
  onRestore: (data: BackupData) => boolean;
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
  id, label, hint, checked, onChange,
}: { id: string; label: string; hint: string; checked: boolean; onChange: (value: boolean) => void }) {
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

/** Three-option segmented control for text size. */
function TextSizePicker({ value, onChange, labels, groupLabel }: { value: TextSize; onChange: (v: TextSize) => void; labels: Record<TextSize, string>; groupLabel: string }) {
  const sampleSize: Record<TextSize, string> = { medium: 'text-[16px]', large: 'text-[20px]', 'x-large': 'text-[24px]' };
  return (
    <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label={groupLabel}>
      {TEXT_SIZES.map((size) => {
        const selected = size === value;
        return (
          <button
            key={size}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(size)}
            className={`flex min-h-[72px] flex-col items-center justify-center gap-1 rounded-tile ${selected ? 'bg-forest text-cream' : 'bg-cream text-forest'}`}
          >
            <span className={`font-semibold ${sampleSize[size]}`}>Aa</span>
            <span className="text-xs">{labels[size]}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SettingsScreen({
  settings, voices, speechSupported, savedPhrases, customTiles, contacts,
  onSaveContact, onRemoveContact, onAddTile, onEditTile, onUpdate, onTestVoice, onRemovePhrase, onBack,
  updateReady, offlineReady, onApplyUpdate, onRestore,
}: SettingsScreenProps) {
  const { t } = useI18n();
  const [editingContact, setEditingContact] = useState<string | null>(null);

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-[14px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="grid size-11 place-items-center rounded-full bg-hairline text-forest"
          aria-label={t('settings', 'back')}
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="font-display text-title leading-none font-light tracking-[-0.02em] text-forest">{t('settings', 'title')}</h1>
      </header>

      {(updateReady || offlineReady) && (
        <Section title={t('settings', 'app-updates')}>
          <div className="flex items-center gap-3">
            <WateringCanIllustration className="size-20 shrink-0" />
            {updateReady ? (
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-forest">{t('settings', 'update-ready')}</p>
                <p className="text-sm text-muted">{t('settings', 'update-ready-hint')}</p>
              </div>
            ) : (
              <p role="status" className="text-forest">{t('settings', 'offline-ready')}</p>
            )}
          </div>
          {updateReady && (
            <button type="button" onClick={onApplyUpdate} className="pressable h-12 rounded-tile bg-forest font-medium text-cream">
              {t('settings', 'update-now')}
            </button>
          )}
        </Section>
      )}

      <Section title={t('settings', 'language')}>
        <p className="-mt-1 text-sm text-muted">{t('settings', 'language-hint')}</p>
        <div className="grid grid-cols-2 gap-1.5" role="radiogroup" aria-label={t('settings', 'language')}>
          {LANGUAGES.map((l) => {
            const selected = l.id === settings.language;
            return (
              <button
                key={l.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onUpdate({ language: l.id as LanguageId })}
                className={`flex min-h-[60px] items-center justify-between gap-2 rounded-tile px-4 ${selected ? 'bg-forest text-cream' : 'bg-cream text-forest'}`}
              >
                <span className="flex flex-col items-start">
                  <span className="text-[17px] font-semibold">{l.nativeLabel}</span>
                  {l.nativeLabel !== l.label && <span className="text-xs opacity-75">{l.label}</span>}
                </span>
                {selected && <Check size={18} aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      </Section>

      <Section title={t('settings', 'text-size')}>
        <p className="-mt-1 text-sm text-muted">{t('settings', 'text-size-hint')}</p>
        <TextSizePicker
          value={settings.textSize}
          onChange={(textSize) => onUpdate({ textSize })}
          groupLabel={t('settings', 'text-size')}
          labels={{ medium: t('settings', 'medium'), large: t('settings', 'large'), 'x-large': t('settings', 'extra-large') }}
        />
      </Section>

      <Section title={t('settings', 'emergency-contacts')}>
        <p className="-mt-1 text-sm text-charcoal">{t('settings', 'emergency-intro')}</p>
        <label htmlFor="your-name" className="flex flex-col gap-1">
          <span className="font-semibold text-forest">{t('settings', 'your-name')}</span>
          <input
            id="your-name"
            value={settings.yourName}
            maxLength={60}
            onChange={(e) => onUpdate({ yourName: e.target.value })}
            placeholder={t('settings', 'your-name-placeholder')}
            className="h-12 rounded-tile bg-cream px-3.5 text-[17px] text-charcoal placeholder:text-muted"
            autoComplete="off"
          />
        </label>

        {contacts.length > 0 && (
          <ul className="flex flex-col gap-1.5">
            {contacts.map((c) =>
              editingContact === c.id ? (
                <li key={c.id}>
                  <ContactForm
                    contact={c}
                    onSave={(next) => {
                      const ok = onSaveContact(next);
                      if (ok) setEditingContact(null);
                      return ok;
                    }}
                    onDelete={(id) => {
                      onRemoveContact(id);
                      setEditingContact(null);
                    }}
                    onCancel={() => setEditingContact(null)}
                  />
                </li>
              ) : (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setEditingContact(c.id)}
                    className="flex w-full items-center gap-3 rounded-tile bg-cream p-1.5 pr-3 text-left"
                    aria-label={`${c.name}`}
                  >
                    <span className="grid size-11 shrink-0 place-items-center rounded-full bg-tile-mint text-forest">
                      <Phone size={18} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold text-forest">{c.name}</span>
                      <span className="truncate text-sm text-muted">
                        {[c.relationship, c.phone].filter(Boolean).join(' · ')}
                      </span>
                    </span>
                    <ChevronRight size={18} className="text-muted" aria-hidden="true" />
                  </button>
                </li>
              ),
            )}
          </ul>
        )}

        {editingContact === 'new' ? (
          <ContactForm
            onSave={(next) => {
              const ok = onSaveContact(next);
              if (ok) setEditingContact(null);
              return ok;
            }}
            onCancel={() => setEditingContact(null)}
          />
        ) : contacts.length < MAX_CONTACTS ? (
          <button
            type="button"
            onClick={() => setEditingContact('new')}
            className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-forest font-medium text-cream"
          >
            <Plus size={20} aria-hidden="true" />
            {t('settings', 'add-contact')}
          </button>
        ) : (
          <p className="text-sm text-muted">{t('settings', 'contact-limit')}</p>
        )}
      </Section>

      <Section title={t('settings', 'your-tiles')}>
        <button
          type="button"
          onClick={onAddTile}
          className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-forest font-medium text-cream"
        >
          <Plus size={20} aria-hidden="true" />
          {t('settings', 'add-tile')}
        </button>
        {customTiles.length === 0 ? (
          <div className="flex items-center gap-3">
            <SeedPacketIllustration className="size-20 shrink-0" />
            <p className="text-sm text-muted">{t('settings', 'no-tiles')}</p>
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {customTiles.map((tile) => {
              const Icon = iconFor(tile.icon);
              const categoryLabel = CATEGORIES.find((c) => c.id === tile.category) ? t('categories', tile.category) : '';
              return (
                <li key={tile.id}>
                  <button
                    type="button"
                    onClick={() => onEditTile(tile.id)}
                    className="flex w-full items-center gap-3 rounded-tile bg-cream p-1.5 pr-3 text-left"
                    aria-label={`${tile.label}, ${categoryLabel}`}
                  >
                    <span className={`tile-edge grid size-11 shrink-0 place-items-center overflow-hidden rounded-[10px] text-forest ${TILE_COLOR_CLASS[tile.color]}`}>
                      {tile.photo ? (
                        <img src={tile.photo} alt="" className="size-full object-cover" />
                      ) : tile.emoji ? (
                        <span className="emoji text-[22px] leading-none" aria-hidden="true">{tile.emoji}</span>
                      ) : (
                        <Icon size={20} aria-hidden="true" />
                      )}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold text-forest">{tile.label}</span>
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

      <Section title={t('settings', 'seeing')}>
        <Toggle
          id="high-visibility"
          label={t('settings', 'high-visibility')}
          hint={t('settings', 'high-visibility-hint')}
          checked={settings.highVisibility}
          onChange={(highVisibility) => onUpdate({ highVisibility })}
        />
      </Section>

      <Section title={t('settings', 'talking')}>
        <Toggle
          id="speak-on-tap"
          label={t('settings', 'speak-on-tap')}
          hint={t('settings', 'speak-on-tap-hint')}
          checked={settings.speakOnTap}
          onChange={(speakOnTap) => onUpdate({ speakOnTap })}
        />
      </Section>

      <Section title={t('settings', 'feel')}>
        <Toggle
          id="playful"
          label={t('settings', 'playful')}
          hint={t('settings', 'playful-hint')}
          checked={settings.playful}
          onChange={(playful) => onUpdate({ playful })}
        />
      </Section>

      <Section title={t('settings', 'voice')}>
        {speechSupported ? (
          <>
            <label htmlFor="voice" className="flex flex-col gap-1.5">
              <span className="font-semibold text-forest">{t('settings', 'voice')}</span>
              <select
                id="voice"
                value={settings.voiceURI ?? ''}
                onChange={(e) => onUpdate({ voiceURI: e.target.value || null })}
                className="h-12 rounded-tile bg-cream px-3 text-charcoal"
              >
                <option value="">{t('settings', 'device-default')}</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
            <label htmlFor="rate" className="flex flex-col gap-1.5">
              <span className="font-semibold text-forest">{t('settings', 'speed')}: {settings.rate.toFixed(1)}×</span>
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
              {t('settings', 'test-voice')}
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <QuietBubbleIllustration className="size-16 shrink-0" />
            <p>{t('settings', 'no-speech')}</p>
          </div>
        )}
      </Section>

      <Section title={t('backup', 'title')}>
        <BackupSection
          current={{
            settings: (({ voiceURI: _voice, ...rest }) => rest)(settings),
            customTiles,
            savedPhrases,
            contacts,
          }}
          onRestore={onRestore}
        />
      </Section>

      <Section title={t('settings', 'saved-phrases')}>
        {savedPhrases.length === 0 ? (
          <p className="text-muted">{t('settings', 'phrase-hint')}</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {savedPhrases.map((phrase) => (
              <li key={phrase} className="flex items-center justify-between gap-2 rounded-tile bg-cream py-1 pr-1 pl-[14px]">
                <span className="min-w-0 text-forest">{phrase}</span>
                <button
                  type="button"
                  onClick={() => onRemovePhrase(phrase)}
                  className="grid size-11 shrink-0 place-items-center rounded-md text-muted"
                  aria-label={`${phrase}`}
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
