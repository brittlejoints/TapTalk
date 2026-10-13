import { ImagePlus, Search, X } from 'lucide-react';
import { useId, useMemo, useRef, useState } from 'react';
import { EMOJI_GROUPS, firstEmoji } from '../data/emoji';
import { ICON_GROUPS, TILE_ICONS, type TileIconId } from '../data/icons';
import { useI18n } from '../lib/i18n';
import { resizePhoto } from '../lib/image';

export type PictureMode = 'icon' | 'emoji' | 'photo';

interface PicturePickerProps {
  mode: PictureMode;
  icon: TileIconId;
  emoji: string | undefined;
  photo: string | undefined;
  onModeChange: (mode: PictureMode) => void;
  onIcon: (id: TileIconId) => void;
  onEmoji: (emoji: string) => void;
  onPhoto: (photo: string | undefined) => void;
  onError: (message: string) => void;
}

const MODES: PictureMode[] = ['icon', 'emoji', 'photo'];
const PHOTO_ERRORS: Record<string, 'photo-not-image' | 'photo-no-canvas' | 'photo-unreadable'> = {
  'not-image': 'photo-not-image',
  'no-canvas': 'photo-no-canvas',
  unreadable: 'photo-unreadable',
};

/** Horizontally scrolling category chips. */
function GroupChips({
  groups,
  current,
  onSelect,
  label,
}: {
  groups: { id: string; label: string; sample?: string }[];
  current: string;
  onSelect: (id: string) => void;
  label: string;
}) {
  return (
    <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="group" aria-label={label}>
      {groups.map((g) => (
        <button
          key={g.id}
          type="button"
          aria-pressed={g.id === current}
          onClick={() => onSelect(g.id)}
          className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold whitespace-nowrap ${
            g.id === current ? 'bg-forest text-cream' : 'bg-cream text-forest'
          }`}
        >
          {g.sample && (
            <span className="emoji text-base leading-none" aria-hidden="true">
              {g.sample}
            </span>
          )}
          {g.label}
        </button>
      ))}
    </div>
  );
}

const cellClass = (selected: boolean) =>
  `grid aspect-square min-h-11 place-items-center rounded-[10px] ${selected ? 'bg-forest text-cream ring-2 ring-forest ring-offset-2 ring-offset-keylime' : 'bg-cream text-forest'}`;

export function PicturePicker({ mode, icon, emoji, photo, onModeChange, onIcon, onEmoji, onPhoto, onError }: PicturePickerProps) {
  const { t } = useI18n();
  const [iconGroup, setIconGroup] = useState(ICON_GROUPS[0].id);
  const [emojiGroup, setEmojiGroup] = useState(EMOJI_GROUPS[0].id);
  const [query, setQuery] = useState('');
  const [typedEmoji, setTypedEmoji] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);
  const searchId = useId();
  const typeId = useId();
  const q = query.trim().toLowerCase();

  // Searching looks across every category in the current mode.
  const iconIds = useMemo<TileIconId[]>(() => {
    if (q) return (Object.keys(TILE_ICONS) as TileIconId[]).filter((id) => `${id} ${TILE_ICONS[id].keywords}`.includes(q));
    return ICON_GROUPS.find((g) => g.id === iconGroup)?.ids ?? [];
  }, [q, iconGroup]);

  const emojiItems = useMemo<[string, string][]>(() => {
    if (q) return EMOJI_GROUPS.flatMap((g) => g.items).filter(([, name]) => name.includes(q));
    return EMOJI_GROUPS.find((g) => g.id === emojiGroup)?.items ?? [];
  }, [q, emojiGroup]);

  const handlePhoto = async (file: File | undefined) => {
    if (!file) return;
    try {
      onPhoto(await resizePhoto(file));
    } catch (e) {
      const key = e instanceof Error ? PHOTO_ERRORS[e.message] : undefined;
      onError(t('editor', key ?? 'photo-failed'));
    }
  };

  return (
    <div className="flex flex-col gap-[14px]">
      {/* Mode switch */}
      <div className="grid grid-cols-3 gap-0.5 rounded-full bg-cream p-1" role="radiogroup" aria-label={t('editor', 'picture-type')}>
        {MODES.map((m) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={mode === m}
            onClick={() => {
              onModeChange(m);
              setQuery('');
            }}
            className={`h-11 rounded-full text-sm font-semibold ${mode === m ? 'bg-forest text-cream' : 'text-forest'}`}
          >
            {t('editor', m)}
          </button>
        ))}
      </div>

      {mode !== 'photo' && (
        <label htmlFor={searchId} className="flex h-11 items-center gap-2 rounded-tile bg-cream px-3 text-forest">
          <Search size={18} aria-hidden="true" className="shrink-0 text-muted" />
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === 'icon' ? t('editor', 'search-icons') : t('editor', 'search-emoji')}
            className="min-w-0 flex-1 bg-transparent text-[16px] text-charcoal outline-none placeholder:text-muted"
            autoComplete="off"
          />
          {query && (
            <button type="button" onClick={() => setQuery('')} className="grid size-11 place-items-center rounded-full" aria-label={t('editor', 'clear-search')}>
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </label>
      )}

      {mode === 'icon' && (
        <>
          {!q && (
            <GroupChips
              groups={ICON_GROUPS.map((g) => ({ id: g.id, label: t('iconGroups', g.id as 'people') }))}
              current={iconGroup}
              onSelect={setIconGroup}
              label={t('editor', 'groups')}
            />
          )}
          <div className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label={t('editor', 'icon-label')}>
            {iconIds.map((id) => {
              const Icon = TILE_ICONS[id].icon;
              return (
                <button key={id} type="button" role="radio" aria-checked={icon === id} aria-label={id.replace(/-/g, ' ')} onClick={() => onIcon(id)} className={cellClass(icon === id)}>
                  <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
                </button>
              );
            })}
          </div>
          {q && iconIds.length === 0 && <p className="text-sm text-muted">{t('editor', 'no-icons').replace('{query}', query)}</p>}
        </>
      )}

      {mode === 'emoji' && (
        <>
          {!q && (
            <GroupChips
              groups={EMOJI_GROUPS.map((g) => ({ id: g.id, label: t('emojiGroups', g.id as 'feelings'), sample: g.items[0][0] }))}
              current={emojiGroup}
              onSelect={setEmojiGroup}
              label={t('editor', 'groups')}
            />
          )}
          <div className="grid grid-cols-6 gap-1.5" role="radiogroup" aria-label={t('editor', 'emoji-label')}>
            {emojiItems.map(([e, name]) => (
              <button key={e} type="button" role="radio" aria-checked={emoji === e} aria-label={name.split(' ')[0]} onClick={() => onEmoji(e)} className={cellClass(emoji === e)}>
                <span className="emoji text-[26px] leading-none" aria-hidden="true">
                  {e}
                </span>
              </button>
            ))}
          </div>
          {q && emojiItems.length === 0 && <p className="text-sm text-muted">{t('editor', 'no-emoji').replace('{query}', query)}</p>}

          <label htmlFor={typeId} className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-forest">{t('editor', 'type-emoji')}</span>
            <input
              id={typeId}
              type="text"
              value={typedEmoji}
              onChange={(e) => {
                const found = firstEmoji(e.target.value);
                setTypedEmoji(found ?? '');
                if (found) onEmoji(found);
                else if (e.target.value) onError(t('editor', 'not-emoji'));
              }}
              placeholder={t('editor', 'type-emoji-placeholder')}
              className="h-12 rounded-tile bg-cream px-3.5 text-[22px] text-charcoal placeholder:text-[15px] placeholder:text-muted"
              autoComplete="off"
            />
          </label>
        </>
      )}

      {mode === 'photo' && (
        <>
          <p className="-mt-1 text-sm text-muted">{t('editor', 'photo-hint')}</p>
          {photo ? (
            <div className="flex items-center gap-3">
              <img src={photo} alt={t('editor', 'chosen-photo')} className="size-16 rounded-[10px] object-cover" />
              <button type="button" onClick={() => fileInput.current?.click()} className="h-11 rounded-full bg-cream px-4 font-medium text-forest">
                {t('editor', 'change')}
              </button>
              <button type="button" onClick={() => onPhoto(undefined)} className="inline-flex h-11 items-center gap-1.5 rounded-full bg-cream px-4 font-medium text-forest">
                <X size={18} aria-hidden="true" />
                {t('editor', 'remove')}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-forest font-medium text-cream"
            >
              <ImagePlus size={20} aria-hidden="true" />
              {t('editor', 'add-photo')}
            </button>
          )}
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              void handlePhoto(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </>
      )}
    </div>
  );
}
