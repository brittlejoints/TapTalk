import { MessageCircle, Settings as SettingsIcon, Siren } from 'lucide-react';
import { useState } from 'react';
import { CategoryTabs } from '../components/CategoryTabs';
import { CoreRow } from '../components/CoreRow';
import { MessageBar } from '../components/MessageBar';
import { TileGrid } from '../components/TileGrid';
import { TILE_ICONS } from '../data/icons';
import { CATEGORIES, type CategoryId, type Word } from '../data/vocabulary';
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

  // Built-in words first, then the user's own tiles, so built-in tiles keep their positions.
  const tileWords: Word[] =
    category.id === 'saved'
      ? savedPhrases.map((label) => ({ label, icon: MessageCircle }))
      : [
          ...category.words,
          ...customTiles
            .filter((t) => t.category === category.id)
            .map((t) => ({ label: t.label, icon: TILE_ICONS[t.icon], photo: t.photo, color: t.color })),
        ];

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
        words={tileWords}
        page={page}
        variant={category.id === 'saved' ? 'phrase' : 'word'}
        onTile={handleWord}
        onNextPage={() => setPage((p) => p + 1)}
      />
    </main>
  );
}
