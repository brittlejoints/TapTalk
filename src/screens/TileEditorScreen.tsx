import { ArrowLeft, Check } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { Tile } from '../components/Tile';
import { TILE_COLOR_CLASS, TILE_COLORS, type TileColorId } from '../data/colors';
import { iconFor, type TileIconId } from '../data/icons';
import { PicturePicker, type PictureMode } from '../components/PicturePicker';
import { CATEGORIES } from '../data/vocabulary';
import { MAX_LABEL_LENGTH, type CustomCategoryId, type CustomTile } from '../lib/customTiles';

const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c.id !== 'saved') as (typeof CATEGORIES[number] & {
  id: CustomCategoryId;
})[];

interface TileEditorScreenProps {
  /** The tile being edited, or undefined for a new tile. */
  tile?: CustomTile;
  onSave: (tile: CustomTile) => boolean;
  onDelete: (id: string) => void;
  onSpeak: (text: string) => void;
  onClose: () => void;
}

function Field({ legend, hint, children }: { legend: string; hint?: string; children: ReactNode }) {
  const headingId = useId();
  return (
    <section role="group" aria-labelledby={headingId} className="flex flex-col gap-[11px] rounded-tile bg-keylime p-[21px]">
      <h2 id={headingId} className="eyebrow text-forest">
        {legend}
      </h2>
      {hint && <p className="-mt-1 text-sm text-muted">{hint}</p>}
      {children}
    </section>
  );
}

const defaultColorFor = (category: CustomCategoryId): TileColorId =>
  CATEGORIES.find((c) => c.id === category)?.color ?? 'keylime';

export function TileEditorScreen({ tile, onSave, onDelete, onSpeak, onClose }: TileEditorScreenProps) {
  const isNew = tile === undefined;
  const [label, setLabel] = useState(tile?.label ?? '');
  const [category, setCategory] = useState<CustomCategoryId>(tile?.category ?? 'needs');
  const [color, setColor] = useState<TileColorId>(tile?.color ?? defaultColorFor('needs'));
  // Until the user picks a color, it follows the category's default.
  const [colorChosen, setColorChosen] = useState(!isNew);
  const [icon, setIcon] = useState<TileIconId>(tile?.icon ?? 'star');
  const [photo, setPhoto] = useState<string | undefined>(tile?.photo);
  const [emoji, setEmoji] = useState<string | undefined>(tile?.emoji);
  const [pictureMode, setPictureMode] = useState<PictureMode>(tile?.photo ? 'photo' : tile?.emoji ? 'emoji' : 'icon');
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const labelId = useId();

  const trimmed = label.trim();

  const chooseCategory = (next: CustomCategoryId) => {
    setCategory(next);
    if (!colorChosen) setColor(defaultColorFor(next));
  };

  const save = () => {
    if (!trimmed) {
      setError('Add a word or phrase for this tile.');
      return;
    }
    if (pictureMode === 'photo' && !photo) {
      setError('Add a photo, or switch to Icon or Emoji.');
      return;
    }
    if (pictureMode === 'emoji' && !emoji) {
      setError('Pick an emoji, or switch to Icon or Photo.');
      return;
    }
    const saved = onSave({
      id: tile?.id ?? crypto.randomUUID(),
      label: trimmed,
      category,
      color,
      icon,
      // Only the chosen picture type is saved; the icon stays as a fallback.
      ...(pictureMode === 'photo' && photo ? { photo } : {}),
      ...(pictureMode === 'emoji' && emoji ? { emoji } : {}),
    });
    if (saved) onClose();
    else setError('Couldn’t save: this device’s storage is full. Remove a photo or delete some tiles, then try again.');
  };

  return (
    <main className="mx-auto flex min-h-full max-w-lg flex-col gap-[14px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(28px,env(safe-area-inset-bottom))]">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClose}
          className="grid size-11 place-items-center rounded-full bg-hairline text-forest"
          aria-label="Cancel and go back"
        >
          <ArrowLeft size={22} aria-hidden="true" />
        </button>
        <h1 className="font-display text-title leading-none font-light tracking-[-0.02em] text-forest">
          {isNew ? 'New tile' : 'Edit tile'}
        </h1>
      </header>

      {/* Live preview, at board size. Tap it to hear how it sounds. */}
      <div className="flex flex-col items-center gap-2 rounded-tile bg-slate p-[21px]">
        <Tile
          label={trimmed || 'Your word'}
          color={color}
          icon={iconFor(icon)}
          photo={pictureMode === 'photo' ? photo : undefined}
          emoji={pictureMode === 'emoji' ? emoji : undefined}
          onClick={() => trimmed && onSpeak(trimmed)}
          className="h-[130px] w-[110px]"
        />
        <span className="text-sm text-forest">Preview · tap to hear it</span>
      </div>

      <div className="flex flex-col gap-1.5 rounded-tile bg-keylime p-[21px]">
        <label htmlFor={labelId} className="eyebrow text-forest">
          Word or phrase
        </label>
        <input
          id={labelId}
          type="text"
          value={label}
          maxLength={MAX_LABEL_LENGTH}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="For example: Grandma, Swing, Apple juice"
          className="h-12 rounded-tile bg-cream px-3.5 text-[17px] text-charcoal placeholder:text-muted"
          autoComplete="off"
        />
        <span className="self-end text-xs text-muted" aria-live="polite">
          {label.length} / {MAX_LABEL_LENGTH}
        </span>
      </div>

      <Field legend="Category">
        <div className="grid grid-cols-2 gap-[7px]">
          {CATEGORY_OPTIONS.map((c) => (
            <label
              key={c.id}
              className={`flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest ${
                category === c.id ? 'bg-forest text-cream' : 'bg-cream text-forest'
              }`}
            >
              <input
                type="radio"
                name="category"
                value={c.id}
                checked={category === c.id}
                onChange={() => chooseCategory(c.id)}
                className="sr-only"
              />
              <c.icon size={18} aria-hidden="true" />
              {c.label}
            </label>
          ))}
        </div>
      </Field>

      <Field legend="Color">
        <div className="grid grid-cols-4 gap-[11px]">
          {TILE_COLORS.map((c) => (
            <label key={c.id} className="flex cursor-pointer flex-col items-center gap-1 text-xs text-forest">
              <input
                type="radio"
                name="color"
                value={c.id}
                checked={color === c.id}
                onChange={() => {
                  setColor(c.id);
                  setColorChosen(true);
                }}
                className="peer sr-only"
              />
              <span
                className={`tile-edge grid size-12 place-items-center rounded-full peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest ${
                  TILE_COLOR_CLASS[c.id]
                } ${color === c.id ? 'ring-2 ring-forest ring-offset-2 ring-offset-keylime' : ''}`}
              >
                {color === c.id && <Check size={20} aria-hidden="true" />}
              </span>
              {c.label}
            </label>
          ))}
        </div>
      </Field>

      <Field legend="Picture">
        <PicturePicker
          mode={pictureMode}
          icon={icon}
          emoji={emoji}
          photo={photo}
          onModeChange={(m) => {
            setPictureMode(m);
            setError(null);
          }}
          onIcon={setIcon}
          onEmoji={(e) => {
            setEmoji(e);
            setError(null);
          }}
          onPhoto={(p) => {
            setPhoto(p);
            setError(null);
          }}
          onError={setError}
        />
      </Field>

      {error && (
        <p role="alert" className="rounded-tile bg-hairline px-[14px] py-[11px] font-medium text-charcoal">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={save}
        className="pressable h-14 rounded-tile bg-forest text-[17px] font-medium text-cream hover:bg-forest-deep"
      >
        {isNew ? 'Add tile to the board' : 'Save changes'}
      </button>

      {!isNew &&
        (confirmingDelete ? (
          <div role="group" aria-label="Confirm delete" className="flex flex-col gap-2 rounded-tile bg-hairline p-[14px]">
            <p className="font-medium text-charcoal">Delete “{tile.label}”? This can’t be undone.</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="h-12 rounded-tile bg-cream font-medium text-forest"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(tile.id);
                  onClose();
                }}
                className="h-12 rounded-tile bg-charcoal font-medium text-cream"
              >
                Delete
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="h-12 font-medium text-forest underline underline-offset-4"
          >
            Delete this tile
          </button>
        ))}
    </main>
  );
}
