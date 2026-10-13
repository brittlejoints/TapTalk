import { CircleX, Delete, Ellipsis, Square, Star, Volume2 } from 'lucide-react';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { useI18n } from '../lib/i18n';

interface MessageBarProps {
  words: string[];
  speaking: boolean;
  /** Index of the word being spoken right now, or -1. */
  spokenIndex: number;
  /** True when the current message is already a saved phrase. */
  saved: boolean;
  /** Speaks the message plus any text still in the typing field. */
  onSpeak: (pending: string) => void;
  onStop: () => void;
  onDelete: () => void;
  /** Clears every word and any draft. */
  onClear: () => void;
  /** Receives the star button, so the board can fly a star from it to the Saved tab. */
  onSave: (from: HTMLElement) => void;
  /** Text typed into the bar but not yet added as words (owned by the board). */
  draft: string;
  onDraftChange: (text: string) => void;
  /** Adds the draft to the message as words. */
  onCommitDraft: () => void;
  /** Shown in place of the typing placeholder when the message is empty (e.g. a greeting). */
  emptyMessage?: string;
}

/** Leaves that drift up from the speak button (hidden by CSS unless playful touches are on). */
const LEAVES = [
  { dx: '-24px', rot: '-35deg', delay: '0ms', opacity: 1 },
  { dx: '2px', rot: '10deg', delay: '90ms', opacity: 0.7 },
  { dx: '26px', rot: '40deg', delay: '170ms', opacity: 0.45 },
];

function caretToEnd(el: HTMLInputElement) {
  const end = el.value.length;
  el.setSelectionRange(end, end);
}

function Bloom() {
  return (
    <>
      {LEAVES.map((leaf, i) => (
        <svg
          key={i}
          className="bloom-leaf text-forest"
          viewBox="0 0 16 16"
          aria-hidden="true"
          style={{ ['--dx' as string]: leaf.dx, ['--rot' as string]: leaf.rot, animationDelay: leaf.delay, opacity: leaf.opacity }}
        >
          <path d="M2 14C2 7 7 2 14 2c0 7-5 12-12 12Z" fill="currentColor" />
        </svg>
      ))}
    </>
  );
}

export function MessageBar({
  words,
  speaking,
  spokenIndex,
  saved,
  onSpeak,
  onStop,
  onDelete,
  onClear,
  onSave,
  draft,
  onDraftChange,
  onCommitDraft,
  emptyMessage,
}: MessageBarProps) {
  const { t } = useI18n();
  const empty = words.length === 0;
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [typing, setTyping] = useState(false);
  // Changing the key replays the bloom each time a message is spoken.
  const [bloomKey, setBloomKey] = useState(0);
  const [justSaved, setJustSaved] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLLabelElement>(null);

  // The bar has a fixed height so tiles never move as a message grows; keep the newest word in view.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [words.length, draft]);

  // The narrow-screen tray closes on Escape, on a tap outside, and when the message empties.
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!bar.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onDown);
    };
  }, [moreOpen]);

  useEffect(() => {
    if (empty) setMoreOpen(false);
  }, [empty]);

  const speak = () => {
    onSpeak(draft);
    if (!empty || draft.trim()) setBloomKey((k) => k + 1);
  };

  const save = (e: MouseEvent<HTMLButtonElement>) => {
    onSave(e.currentTarget);
    setJustSaved(true);
  };

  return (
    <div ref={bar} className="relative flex h-[74px] shrink-0 items-center gap-1 rounded-tile bg-keylime py-2 pr-2 pl-3.5">
      <label
        ref={scroller}
        htmlFor={inputId}
        className="flex max-h-full min-h-11 min-w-0 flex-1 cursor-text flex-wrap content-start items-center gap-x-1.5 gap-y-1 overflow-y-auto overscroll-contain py-0.5 leading-tight font-semibold text-forest">
        <span className="contents" aria-live="polite" aria-label={empty ? 'Message is empty' : `Message: ${words.join(' ')}`}>
          {words.map((word, i) => (
            <span
              key={i}
              className={`chip-in message-chip rounded-full px-2.5 py-0.5 text-[20px] transition-colors duration-150 ${
                i === spokenIndex ? 'bg-forest text-cream' : 'bg-cream'
              }`}
            >
              {word}
            </span>
          ))}
        </span>
        <input
          ref={input}
          id={inputId}
          type="text"
          value={draft}
          maxLength={40}
          onChange={(e) => onDraftChange(e.target.value)}
          onFocus={(e) => {
            setTyping(true);
            caretToEnd(e.currentTarget);
          }}
          onClick={(e) => caretToEnd(e.currentTarget)}
          onBlur={() => setTyping(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onCommitDraft();
            } else if (e.key === 'Escape') {
              input.current?.blur();
            }
          }}
          placeholder={empty ? emptyMessage ?? t('message', 'placeholder') : typing ? t('message', 'type-a-word') : ''}
          aria-label={t('message', 'type-a-word')}
          enterKeyHint="done"
          autoComplete="off"
          autoCapitalize="sentences"
          className={`message-chip min-w-0 flex-1 bg-transparent py-0.5 text-[20px] font-semibold text-forest outline-none placeholder:text-[16px] placeholder:font-normal placeholder:text-muted ${
            empty || typing || draft ? 'basis-[8ch]' : 'basis-1'
          }`}
        />
      </label>

      {!empty &&
        (saved ? (
          <span className="grid size-11 place-items-center text-forest compact:hidden" role="img" aria-label={t('message', 'is-saved')}>
            <Star size={22} fill="currentColor" aria-hidden="true" className={justSaved ? 'twinkle' : ''} />
          </span>
        ) : (
          <button type="button" onClick={save} className="grid size-11 place-items-center rounded-md text-forest compact:hidden" aria-label={t('message', 'save-phrase')}>
            <Star size={22} aria-hidden="true" />
          </button>
        ))}
      {words.length >= 2 && (
        <button
          type="button"
          onClick={() => {
            onClear();
            setJustSaved(false);
          }}
          className="grid size-11 place-items-center rounded-md text-muted compact:hidden"
          aria-label={t('message', 'clear')}
          title={t('message', 'clear')}
        >
          <CircleX size={22} aria-hidden="true" />
        </button>
      )}
      {!empty && (
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-expanded={moreOpen}
          aria-haspopup="true"
          aria-controls={`${inputId}-more`}
          aria-label={t('message', 'more-actions')}
          className="hidden size-11 place-items-center rounded-md text-forest compact:grid"
        >
          <Ellipsis size={22} aria-hidden="true" />
        </button>
      )}
      {moreOpen && !empty && (
        <div id={`${inputId}-more`} className="absolute top-full right-0 z-10 mt-1 flex flex-col gap-1 rounded-tile bg-cream p-1.5">
          {saved ? (
            <span className="flex h-12 items-center gap-2 px-3 font-semibold text-forest" role="img" aria-label={t('message', 'is-saved')}>
              <Star size={20} fill="currentColor" aria-hidden="true" />
              {t('message', 'is-saved')}
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                save(e);
                setMoreOpen(false);
              }}
              className="flex h-12 items-center gap-2 rounded-md bg-keylime px-3 font-semibold whitespace-nowrap text-forest"
            >
              <Star size={20} aria-hidden="true" />
              {t('message', 'save-phrase')}
            </button>
          )}
          {words.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                onClear();
                setJustSaved(false);
                setMoreOpen(false);
              }}
              className="flex h-12 items-center gap-2 rounded-md bg-keylime px-3 font-semibold whitespace-nowrap text-forest"
            >
              <CircleX size={20} aria-hidden="true" />
              {t('message', 'clear')}
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          if (draft) onDraftChange(draft.slice(0, -1));
          else onDelete();
          setJustSaved(false);
        }}
        disabled={empty && !draft}
        className="grid h-13 w-11 place-items-center rounded-md text-forest disabled:opacity-40"
        aria-label={draft ? t('message', 'delete-last-letter') : t('message', 'delete-last-word')}
      >
        <Delete size={22} aria-hidden="true" />
      </button>
      <span className="relative">
        {speaking ? (
          <button type="button" onClick={onStop} className="pressable grid size-14 place-items-center rounded-tile bg-forest text-cream" aria-label={t('message', 'stop')}>
            <Square size={22} fill="currentColor" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={speak}
            className="pressable grid size-14 place-items-center rounded-tile bg-forest text-cream"
            aria-label={t('message', 'speak')}
          >
            <Volume2 size={26} aria-hidden="true" />
          </button>
        )}
        {bloomKey > 0 && (
          <span key={bloomKey} className="pointer-events-none absolute inset-0" aria-hidden="true">
            <Bloom />
          </span>
        )}
      </span>
    </div>
  );
}
