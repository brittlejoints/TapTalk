import { MessageCircle, Settings as SettingsIcon, Siren, Sprout } from 'lucide-react';
import { useState } from 'react';
import { CategoryTabs } from '../components/CategoryTabs';
import { CoreRow } from '../components/CoreRow';
import { MessageBar } from '../components/MessageBar';
import { TileGrid, type NavSlot } from '../components/TileGrid';
import { TILE_ICONS } from '../data/icons';
import { CATEGORIES, TILES_PER_PAGE, type CategoryId, type Word } from '../data/vocabulary';
import { boardPage, type Slot } from '../lib/boardPages';
import type { CustomTile } from '../lib/customTiles';
import { addWord, removeLastWord, toSentence } from '../lib/message';

interface BoardScreenProps {
  savedPhrases: string[];
  customTiles: CustomTile[];
  speakOnTap: boolean;
  speaking: boolean;
  onSpeak: (text: string) => void;
  onStop: () => void;
  onSavePhrase: (phrase: string) => void;
  onHelp: () => void;
  onSettings: () => void;
}

export function BoardScreen({
  savedPhrases,
  customTiles,
  speakOnTap,
  speaking,
  onSpeak,
  onStop,
  onSavePhrase,
  onHelp,
  onSettings,
}: BoardScreenProps) {
  const [categoryId, setCategoryId] = useState<CategoryId>('needs');
  const [page, setPage] = useState(0);
  const [words, setWords] = useState<string[]>([]);
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[1];

  const isSaved = category.id === 'saved';
  const customWords: Word[] = customTiles
    .filter((t) => t.category === category.id)
    .map((t) => ({ label: t.label, icon: TILE_ICONS[t.icon], photo: t.photo, color: t.color }));

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

  const handleWord = (word: string) => {
    setWords((prev) => addWord(prev, word));
    if (speakOnTap) onSpeak(word);
  };

  return (
    <main className="mx-auto flex h-full max-w-2xl flex-col gap-[11px] px-3.5 pt-[max(11px,env(safe-area-inset-top))] pb-[max(14px,env(safe-area-inset-bottom))]">
      <header className="flex min-h-11 items-center justify-between">
        <h1 className="font-display text-[27px] leading-none font-light tracking-[-0.01em] text-forest">
          Tap Talk
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
        saved={savedPhrases.some((p) => p.toLowerCase() === sentence.toLowerCase())}
        onSpeak={() => onSpeak(sentence)}
        onStop={onStop}
        onDelete={() => setWords(removeLastWord)}
        onSave={() => onSavePhrase(sentence)}
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
