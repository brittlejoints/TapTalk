import { Delete, Square, Star, Volume2 } from 'lucide-react';

interface MessageBarProps {
  words: string[];
  speaking: boolean;
  canSave: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onDelete: () => void;
  onSave: () => void;
}

export function MessageBar({ words, speaking, canSave, onSpeak, onStop, onDelete, onSave }: MessageBarProps) {
  const empty = words.length === 0;

  return (
    <div className="flex min-h-[74px] items-center gap-1 rounded-tile bg-keylime py-2 pr-2 pl-3.5">
      <p
        className="flex min-w-0 flex-1 flex-wrap items-center gap-x-1.5 gap-y-1 text-message leading-tight font-semibold text-forest"
        aria-live="polite"
        aria-label={empty ? 'Message is empty' : `Message: ${words.join(' ')}`}
      >
        {empty ? (
          <span className="text-ui font-normal text-muted">Tap words to build a message</span>
        ) : (
          words.map((word, i) => (
            <span key={i} className="rounded-full bg-cream px-2.5 py-0.5">
              {word}
            </span>
          ))
        )}
      </p>

      {canSave && !empty && (
        <button
          type="button"
          onClick={onSave}
          className="grid size-11 place-items-center rounded-md text-forest"
          aria-label="Save this phrase"
        >
          <Star size={22} aria-hidden="true" />
        </button>
      )}
      <button
        type="button"
        onClick={onDelete}
        disabled={empty}
        className="grid h-13 w-11 place-items-center rounded-md text-forest disabled:opacity-40"
        aria-label="Delete last word"
      >
        <Delete size={22} aria-hidden="true" />
      </button>
      {speaking ? (
        <button
          type="button"
          onClick={onStop}
          className="pressable grid size-14 place-items-center rounded-tile bg-forest text-cream"
          aria-label="Stop speaking"
        >
          <Square size={22} fill="currentColor" aria-hidden="true" />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSpeak}
          className="pressable grid size-14 place-items-center rounded-tile bg-forest text-cream"
          aria-label="Speak message"
        >
          <Volume2 size={26} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
