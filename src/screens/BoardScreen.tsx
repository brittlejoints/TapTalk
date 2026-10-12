import { MessageCircle, Settings as SettingsIcon, Siren, Sprout } from 'lucide-react';
import { useRef, useState } from 'react';
import { CategoryTabs } from '../components/CategoryTabs';
import { CoreRow } from '../components/CoreRow';
import { MessageBar } from '../components/MessageBar';
import { TileGrid, type NavSlot } from '../components/TileGrid';
import { iconFor } from '../data/icons';
import { CATEGORIES, TILES_PER_PAGE, type CategoryId, type Word } from '../data/vocabulary';
import { boardPage, type Slot } from '../lib/boardPages';
import type { CustomTile } from '../lib/customTiles';
import { flyStarTo, tapHaptic } from '../lib/delight';
import { addTypedWords, addWord, removeLastWord, toSentence } from '../lib/message';
import { greetingNow } from '../lib/greeting';
import { loadJSON, saveJSON } from '../lib/storage';
import { wordIndexAt } from '../lib/useSpeech';
import { Wordmark } from '../components/Wordmark';

interface BoardScreenProps {
  /** The user's name, used in the daily greeting. */
  yourName: string;
  savedPhrases: string[];
  customTiles: CustomTile[];
  speakOnTap: boolean;
  speaking: boolean;
  /** What the speech engine is saying, and where it is, for the word highlight. */
  spokenText: string | null;
  spokenCharIndex: number | null;
  wordPulse: number;
  onSpeak: (text: string) => void;
  onStop: () => void;
  onSavePhrase: (phrase: string) => void;
  onHelp: () => void;
  onSettings: () => void;
}

export function BoardScreen({
  yourName,
  savedPhrases,
  customTiles,
  speakOnTap,
  speaking,
  spokenText,
  spokenCharIndex,
  wordPulse,
  onSpeak,
  onStop,
  onSavePhrase,
  onHelp,
  onSettings,
}: BoardScreenProps) {
  const [categoryId, setCategoryId] = useState<CategoryId>('needs');
  const [page, setPage] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  // Show the greeting as the empty-bar placeholder until the user interacts, but
  // only once per day. Stored as an ISO date so comparing is just string equality.
  const today = new Date().toISOString().slice(0, 10);
  const alreadyGreetedToday = useRef<boolean>(
    loadJSON<string>('last-greet-date', '', (v): v is string => typeof v === 'string') === today,
  );
  const [showGreeting, setShowGreeting] = useState(!alreadyGreetedToday.current);
  const consumeGreeting = () => {
    if (!showGreeting) return;
    saveJSON('last-greet-date', today);
    setShowGreeting(false);
    alreadyGreetedToday.current = true;
  };
  /** Text typed into the message bar that hasn't become words yet. */
  const [draft, setDraft] = useState('');
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[1];

  const isSaved = category.id === 'saved';
  const customWords: Word[] = customTiles
    .filter((t) => t.category === category.id)
    .map((t) => ({ label: t.label, icon: iconFor(t.icon), photo: t.photo, emoji: t.emoji, color: t.color }));

  // Saved phrases fill all 9 slots. Other categories keep slot 9 for "My words".
  const layout = isSaved
    ? {
        page: 0,
        slots: Array.from({ length: TILES_PER_PAGE }, (_, i): Slot<Word> =>
          savedPhrases[i] ? { kind: 'word', word: { label: savedPhrases[i], icon: MessageCircle } } : null,
        ),
      }
    : boardPage(category.words, customWords, page);

  const handleNav = (slot: NavSlot) => {
    if (slot.kind === 'mine') setPage(1);
    else if (slot.kind === 'more') setPage(slot.page + 1);
    else setPage(0);
  };

  const emptyMessage =
    isSaved && savedPhrases.length === 0 ? (
      <>
        <Sprout size={40} strokeWidth={1.4} className="text-forest" aria-hidden="true" />
        <p className="font-display text-[28px] leading-tight font-light text-forest">Nothing saved yet</p>
        <p className="max-w-[28ch] text-charcoal">Build a message, then tap the star to keep it here.</p>
      </>
    ) : !isSaved && layout.page > 0 && customWords.length === 0 ? (
      <>
        <Sprout size={40} strokeWidth={1.4} className="text-forest" aria-hidden="true" />
        <p className="font-display text-[28px] leading-tight font-light text-forest">Your own words grow here</p>
        <p className="max-w-[30ch] text-charcoal">Add names, places and favorites in Settings, under Your tiles.</p>
      </>
    ) : undefined;

  const selectCategory = (id: CategoryId) => {
    setCategoryId(id);
    setPage(0);
  };
  const sentence = toSentence(words);

  /** Turns any typed draft into words first, so typing then tapping keeps the order. */
  const withDraft = (base: string[]) => (draft.trim() ? addTypedWords(base, draft) : base);

  const handleWord = (word: string) => {
    tapHaptic();
    consumeGreeting();
    setWords(addWord(withDraft(words), word));
    setDraft('');
    if (speakOnTap) onSpeak(word);
  };

  const commitDraft = () => {
    consumeGreeting();
    setWords(withDraft(words));
    setDraft('');
  };

  const speakMessage = (pending: string) => {
    consumeGreeting();
    const all = pending.trim() ? addTypedWords(words, pending) : words;
    setWords(all);
    setDraft('');
    onSpeak(toSentence(all));
  };

  // Highlight the word being spoken, but only when it's this message being read.
  const spokenIndex =
    speaking && spokenText === sentence && spokenCharIndex !== null ? wordIndexAt(words, spokenCharIndex) : -1;

  return (
    <main className="mx-auto flex h-full max-w-2xl flex-col gap-[11px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(14px,env(safe-area-inset-bottom))]">
      <header className="flex min-h-11 items-center justify-between">
        <h1 className="text-forest">
          <Wordmark className="h-[30px] w-auto" talkPulse={speaking ? wordPulse : 0} />
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onHelp}
            className="pressable inline-flex h-11 items-center gap-1.5 rounded-full bg-help px-4 font-semibold text-cream"
          >
            <Siren size={20} aria-hidden="true" />
            Help
          </button>
          <button
            type="button"
            onClick={onSettings}
            className="grid size-11 place-items-center rounded-md text-forest"
            aria-label="Settings"
          >
            <SettingsIcon size={22} aria-hidden="true" />
          </button>
        </div>
      </header>

      <MessageBar
        words={words}
        speaking={speaking}
        spokenIndex={spokenIndex}
        saved={savedPhrases.some((p) => p.toLowerCase() === sentence.toLowerCase())}
        onSpeak={speakMessage}
        onStop={onStop}
        onDelete={() => setWords(removeLastWord)}
        onClear={() => {
          setWords([]);
          setDraft('');
        }}
        onSave={(from) => {
          onSavePhrase(sentence);
          flyStarTo(from, document.getElementById('tab-saved'));
        }}
        draft={draft}
        onDraftChange={(text) => {
          if (text) consumeGreeting();
          setDraft(text);
        }}
        onCommitDraft={commitDraft}
        emptyMessage={showGreeting ? `${greetingNow(yourName)} · tap words, or tap here to type` : undefined}
      />

      <CoreRow onWord={handleWord} />

      <CategoryTabs categories={CATEGORIES} current={categoryId} onSelect={selectCategory} />

      <TileGrid
        category={category}
        slots={layout.slots}
        variant={isSaved ? 'phrase' : 'word'}
        emptyMessage={emptyMessage}
        onTile={handleWord}
        onNav={handleNav}
      />
    </main>
  );
}
