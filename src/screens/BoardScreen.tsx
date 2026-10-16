import { MessageCircle, Settings as SettingsIcon, Siren } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CategoryTabs } from '../components/CategoryTabs';
import { CoreRow } from '../components/CoreRow';
import { MessageBar } from '../components/MessageBar';
import { TileGrid, type NavSlot } from '../components/TileGrid';
import { AppIcon } from '../components/LogoMark';
import { Wordmark } from '../components/Wordmark';
import { FernIllustration, PotIllustration } from '../components/illustrations';
import { iconFor } from '../data/icons';
import { CATEGORIES, TILES_PER_PAGE, type CategoryId, type Word, type WordDef } from '../data/vocabulary';
import { boardPage, type Slot } from '../lib/boardPages';
import type { CustomTile } from '../lib/customTiles';
import { flyStarTo, tapHaptic } from '../lib/delight';
import { useI18n } from '../lib/i18n';
import { addTypedWords, addWord, removeLastWord, toSentence } from '../lib/message';
import { loadJSON, saveJSON } from '../lib/storage';
import { wordIndexAt } from '../lib/useSpeech';

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
  /** Returns false when the phrase could not be saved (the Saved page is full). */
  onSavePhrase: (phrase: string) => boolean;
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
  const { t } = useI18n();
  const [categoryId, setCategoryId] = useState<CategoryId>('needs');
  const [page, setPage] = useState(0);
  const [words, setWords] = useState<string[]>([]);
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
  const [draft, setDraft] = useState('');
  // Replays the logo's letter hop each time Speak is tapped with something to say.
  const [logoWave, setLogoWave] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);
  const noticeTimer = useRef<number>();
  const flash = (text: string) => {
    setNotice(text);
    window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(null), 3500);
  };
  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);
  const countWords = (text: string) => text.split(/\s+/).filter(Boolean).length;
  const category = CATEGORIES.find((c) => c.id === categoryId) ?? CATEGORIES[1];

  const isSaved = category.id === 'saved';

  /** Built-in words translated to the current language. The label becomes what gets spoken. */
  const translatedWords = (cat: typeof category): Word[] =>
    cat.words.map((w: WordDef) => ({
      label: t(cat.id as 'needs' | 'feelings' | 'people' | 'medical', w.key as never),
      icon: w.icon,
    }));

  const customWords: Word[] = customTiles
    .filter((tile) => tile.category === category.id)
    .map((tile) => ({ label: tile.label, icon: iconFor(tile.icon), photo: tile.photo, emoji: tile.emoji, color: tile.color }));

  const layout = isSaved
    ? {
        page: 0,
        slots: Array.from({ length: TILES_PER_PAGE }, (_, i): Slot<Word> =>
          savedPhrases[i] ? { kind: 'word', word: { label: savedPhrases[i], icon: MessageCircle } } : null,
        ),
      }
    : boardPage(translatedWords(category), customWords, page);

  const handleNav = (slot: NavSlot) => {
    if (slot.kind === 'mine') setPage(1);
    else if (slot.kind === 'more') setPage(slot.page + 1);
    else setPage(0);
  };

  const emptyMessage =
    isSaved && savedPhrases.length === 0 ? (
      <>
        <PotIllustration className="size-20" />
        <p className="font-display text-[28px] leading-tight font-light text-forest">{t('message', 'nothing-saved')}</p>
        <p className="max-w-[28ch] text-charcoal">{t('message', 'nothing-saved-hint')}</p>
      </>
    ) : !isSaved && layout.page > 0 && customWords.length === 0 ? (
      <>
        <FernIllustration className="size-20" />
        <p className="font-display text-[28px] leading-tight font-light text-forest">{t('message', 'own-words')}</p>
        <p className="max-w-[30ch] text-charcoal">{t('message', 'own-words-hint')}</p>
      </>
    ) : undefined;

  const selectCategory = (id: CategoryId) => {
    setCategoryId(id);
    setPage(0);
  };
  const sentence = toSentence(words);

  const withDraft = (base: string[]) => (draft.trim() ? addTypedWords(base, draft) : base);

  const handleWord = (word: string) => {
    tapHaptic();
    consumeGreeting();
    const next = addWord(withDraft(words), word);
    // A word that doesn't fit is never dropped silently.
    if (next.length - words.length < countWords(draft) + 1) flash(t('message', 'message-full'));
    setWords(next);
    setDraft('');
    if (speakOnTap) onSpeak(word);
  };

  const commitDraft = () => {
    consumeGreeting();
    const next = withDraft(words);
    if (next.length - words.length < countWords(draft)) flash(t('message', 'message-full'));
    setWords(next);
    setDraft('');
  };

  const speakMessage = (pending: string) => {
    consumeGreeting();
    const all = pending.trim() ? addTypedWords(words, pending) : words;
    if (all.length > 0) setLogoWave((n) => n + 1);
    if (all.length - words.length < countWords(pending)) flash(t('message', 'message-full'));
    setWords(all);
    setDraft('');
    onSpeak(toSentence(all));
  };

  const spokenIndex =
    speaking && spokenText === sentence && spokenCharIndex !== null ? wordIndexAt(words, spokenCharIndex) : -1;

  const hour = new Date().getHours();
  const greetingBase =
    hour >= 5 && hour < 12 ? t('greeting', 'morning') : hour >= 12 && hour < 18 ? t('greeting', 'afternoon') : t('greeting', 'evening');
  const greetingText = yourName.trim() ? `${greetingBase}, ${yourName.trim()}` : greetingBase;

  return (
    <main className="mx-auto flex h-full max-w-2xl flex-col gap-[11px] roomy:max-w-5xl roomy:gap-3.5 side:grid side:max-w-[1440px] side:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] side:grid-rows-[auto_auto_auto_auto_minmax(0,1fr)] roomy:side:grid-rows-[auto_minmax(0,1fr)_auto_auto] side:gap-x-3 side:gap-y-[7px] roomy:side:gap-x-5 roomy:side:gap-y-3 px-3.5 roomy:px-6 pt-[max(11px,env(safe-area-inset-top))] pb-[max(14px,env(safe-area-inset-bottom))]">
      <header className="flex min-h-11 items-center justify-between">
        <h1 className="flex items-center gap-2 text-forest">
          <AppIcon className="hidden size-8 min-[390px]:block roomy:size-10 short:hidden" />
          <Wordmark className="h-[30px] w-auto roomy:h-9 short:h-6" talkPulse={speaking ? wordPulse : 0} wave={logoWave} />
        </h1>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onHelp}
            className="pressable inline-flex h-11 items-center gap-1.5 rounded-full bg-help px-4 short:px-3 font-semibold text-cream"
          >
            <Siren size={20} aria-hidden="true" />
            {t('help', 'title')}
          </button>
          <button
            type="button"
            onClick={onSettings}
            className="grid size-11 place-items-center rounded-md text-forest"
            aria-label={t('settings', 'title')}
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
          const saved = onSavePhrase(sentence);
          if (saved) flyStarTo(from, document.getElementById('tab-saved'));
          else flash(t('message', 'saved-full'));
          return saved;
        }}
        notice={notice ?? undefined}
        draft={draft}
        onDraftChange={(text) => {
          if (text) consumeGreeting();
          setDraft(text);
        }}
        onCommitDraft={commitDraft}
        emptyMessage={showGreeting ? `${greetingText} · ${t('message', 'placeholder').toLowerCase()}` : undefined}
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
