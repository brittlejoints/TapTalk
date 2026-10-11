import { Delete, Square, Star, Volume2 } from 'lucide-react';
import { useState } from 'react';

interface MessageBarProps {
  words: string[];
  speaking: boolean;
  /** True when the current message is already a saved phrase. */
  saved: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onDelete: () => void;
  onSave: () => void;
}

/** Leaves that drift up from the speak button (hidden by CSS unless playful touches are on). */
const LEAVES = [
  { dx: '-24px', rot: '-35deg', delay: '0ms', opacity: 1 },
  { dx: '2px', rot: '10deg', delay: '90ms', opacity: 0.7 },
  { dx: '26px', rot: '40deg', delay: '170ms', opacity: 0.45 },
];

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

export function MessageBar({ words, speaking, saved, onSpeak, onStop, onDelete, onSave }: MessageBarProps) {
  const empty = words.length === 0;
  // Changing the key replays the bloom each time a message is spoken.
  const [bloomKey, setBloomKey] = useState(0);
  const [justSaved, setJustSaved] = useState(false);

  const speak = () => {
    onSpeak();
    if (!empty) setBloomKey((k) => k + 1);
  };

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
            <span key={i} className="chip-in rounded-full bg-cream px-2.5 py-0.5">
              {word}
            </span>
          ))
        )}
      </p>

      {!empty &&
        (saved ? (
          <span
            className="grid size-11 place-items-center text-forest"
            role="img"
            aria-label="This phrase is saved"
          >
            <Star size={22} fill="currentColor" aria-hidden="true" className={justSaved ? 'twinkle' : ''} />
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              onSave();
              setJustSaved(true);
            }}
            className="grid size-11 place-items-center rounded-md text-forest"
            aria-label="Save this phrase"
          >
            <Star size={22} aria-hidden="true" />
          </button>
        ))}
      <button
        type="button"
        onClick={() => {
          onDelete();
          setJustSaved(false);
        }}
        disabled={empty}
        className="grid h-13 w-11 place-items-center rounded-md text-forest disabled:opacity-40"
        aria-label="Delete last word"
      >
        <Delete size={22} aria-hidden="true" />
      </button>
      <span className="relative">
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
            onClick={speak}
            className="pressable grid size-14 place-items-center rounded-tile bg-forest text-cream"
            aria-label="Speak message"
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
