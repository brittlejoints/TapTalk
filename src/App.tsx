import { useEffect, useMemo, useRef, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { STRINGS } from './data/strings';
import { TILES_PER_PAGE } from './data/vocabulary';
import { useEmergencyContacts } from './lib/contacts';
import { flushInsights, record, startInsights, type Snapshot } from './lib/insights';
import { useCustomTiles } from './lib/customTiles';
import { I18nProvider, useI18n } from './lib/i18n';
import type { BackupData } from './lib/backup';
import { savePhrase } from './lib/message';
import { useSettings } from './lib/settings';
import { isStringArray, loadJSON, saveJSON } from './lib/storage';
import { useSpeech } from './lib/useSpeech';
import { BoardScreen } from './screens/BoardScreen';
import { HelpScreen } from './screens/HelpScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { TileEditorScreen } from './screens/TileEditorScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

type View = 'welcome' | 'board' | 'help' | 'settings' | 'tile-editor';

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

export default function App() {
  const { settings, update } = useSettings();
  // Pass language to speech so the voice reads in the matching tongue.
  const speech = useSpeech(settings.voiceURI, settings.rate, settings.language);
  // 'prompt' mode: a new version waits until the user taps Update, so a message is never wiped mid-sentence.
  const sw = useRegisterSW();
  const custom = useCustomTiles();
  const emergency = useEmergencyContacts();
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [view, setView] = useState<View>(() =>
    loadJSON('onboarded', false, isBoolean) ? 'board' : 'welcome',
  );
  // Default saved phrases come from the chosen language. Changing language later
  // leaves the user's own saved list alone — they're their words.
  const [savedPhrases, setSavedPhrases] = useState<string[]>(() => {
    // Seed only on first launch (key missing). An empty list means the user cleared it on purpose.
    const seen = (() => { try { return localStorage.getItem('tap-talk:saved-phrases') !== null; } catch { return false; } })();
    return seen ? loadJSON<string[]>('saved-phrases', [], isStringArray) : STRINGS[settings.language].savedPhrases;
  });

  useEffect(() => {
    saveJSON('saved-phrases', savedPhrases);
  }, [savedPhrases]);

  // Optional anonymous counts (off unless the person turns sharing on in Settings).
  // A finished week is sent at start, when the app returns to the foreground, and when the connection returns.
  const snapshotRef = useRef<Snapshot | null>(null);
  snapshotRef.current = {
    language: settings.language,
    textSize: settings.textSize,
    customTiles: custom.tiles.length,
    hasContacts: emergency.contacts.length > 0,
    playful: settings.playful,
    speakOnTap: settings.speakOnTap,
    highVisibility: settings.highVisibility,
  };
  useEffect(() => {
    startInsights(window.location.search);
    record('sessions');
    const flush = () => {
      if (snapshotRef.current && document.visibilityState === 'visible') void flushInsights(snapshotRef.current);
    };
    flush();
    window.addEventListener('online', flush);
    document.addEventListener('visibilitychange', flush);
    return () => {
      window.removeEventListener('online', flush);
      document.removeEventListener('visibilitychange', flush);
    };
  }, []);

  // Screen changes move keyboard and screen reader focus: a newly opened screen
  // focuses its heading, and returning to the board puts focus back on the button
  // that left it. The welcome guide focuses its own step headings.
  const boardReturnFocus = useRef<HTMLElement | null>(null);
  const firstView = useRef(true);
  useEffect(() => {
    if (firstView.current) {
      firstView.current = false;
      return;
    }
    if (view === 'welcome') return;
    if (view === 'board' && boardReturnFocus.current?.isConnected) {
      boardReturnFocus.current.focus();
      return;
    }
    const heading = Array.from(document.querySelectorAll('h1')).find((h) => h.getClientRects().length > 0);
    if (!heading) return;
    if (!heading.hasAttribute('tabindex')) heading.setAttribute('tabindex', '-1');
    heading.focus();
  }, [view]);

  // Help, Settings and the tile editor are history entries, so the phone's Back button or swipe
  // returns to the previous screen instead of leaving the app.
  const open = (next: View, opts?: { replace?: boolean }) => {
    if (next === 'help') record('helpOpened');
    if (view === 'board' && document.activeElement instanceof HTMLElement) boardReturnFocus.current = document.activeElement;
    try {
      if (opts?.replace) window.history.replaceState({ tt: next }, '');
      else window.history.pushState({ tt: next }, '');
    } catch {
      // History can be unavailable; the screen still changes.
    }
    setView(next);
  };
  const back = () => {
    if (window.history.state?.tt) window.history.back();
    else setView('board');
  };

  useEffect(() => {
    try {
      window.history.replaceState({}, '');
    } catch {
      // ignore
    }
    const onPop = (e: PopStateEvent) => setView(e.state?.tt ?? 'board');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Replaces everything on this device from a backup. The device's own voice choice is kept.
  const restore = (data: BackupData): boolean => {
    const savedOk = saveJSON('saved-phrases', data.savedPhrases);
    const tilesOk = custom.replaceTiles(data.customTiles);
    const contactsOk = emergency.replaceContacts(data.contacts);
    if (savedOk) setSavedPhrases(data.savedPhrases);
    update({ ...data.settings });
    return savedOk && tilesOk && contactsOk;
  };

  // The guide opened again from Settings is a history entry, so finishing it steps back; first launch has none.
  const start = () => {
    saveJSON('onboarded', true);
    if (window.history.state?.tt === 'welcome') window.history.back();
    else setView('board');
  };

  // The size class on <html> is picked up by CSS text-size rules.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove('size-large', 'size-x-large');
    if (settings.textSize === 'large') html.classList.add('size-large');
    if (settings.textSize === 'x-large') html.classList.add('size-x-large');
    html.lang = settings.language;
  }, [settings.textSize, settings.language]);

  return (
    <ErrorBoundary>
      <I18nProvider lang={settings.language}>
        <AppShell
          view={view}
          open={open}
          back={back}
          start={start}
          settings={settings}
          update={update}
          speech={speech}
          custom={custom}
          emergency={emergency}
          editingTileId={editingTileId}
          setEditingTileId={setEditingTileId}
          savedPhrases={savedPhrases}
          setSavedPhrases={setSavedPhrases}
          updateReady={sw.needRefresh[0]}
          offlineReady={sw.offlineReady[0]}
          onApplyUpdate={() => void sw.updateServiceWorker(true)}
          onRestore={restore}
          onReplayWelcome={() => open('welcome', { replace: true })}
        />
      </I18nProvider>
    </ErrorBoundary>
  );
}

interface ShellProps {
  view: View;
  open: (v: View, opts?: { replace?: boolean }) => void;
  back: () => void;
  start: () => void;
  settings: ReturnType<typeof useSettings>['settings'];
  update: ReturnType<typeof useSettings>['update'];
  speech: ReturnType<typeof useSpeech>;
  custom: ReturnType<typeof useCustomTiles>;
  emergency: ReturnType<typeof useEmergencyContacts>;
  editingTileId: string | null;
  setEditingTileId: (id: string | null) => void;
  savedPhrases: string[];
  setSavedPhrases: React.Dispatch<React.SetStateAction<string[]>>;
  updateReady: boolean;
  offlineReady: boolean;
  onApplyUpdate: () => void;
  onRestore: (data: BackupData) => boolean;
  onReplayWelcome: () => void;
}

/** Inside I18nProvider so screens can translate. The one `onTestVoice` message is translated here. */
function AppShell({ view, open, back, start, settings, update, speech, custom, emergency, editingTileId, setEditingTileId, savedPhrases, setSavedPhrases, updateReady, offlineReady, onApplyUpdate, onRestore, onReplayWelcome }: ShellProps) {
  const { t } = useI18n();
  const boardMounted = useRef(false);
  if (view === 'board') boardMounted.current = true;
  const testVoiceMessage = useMemo(() => {
    // Keep the voice test tied to the greeting language so the user hears their chosen voice.
    const hour = new Date().getHours();
    return hour >= 5 && hour < 12 ? t('greeting', 'morning') : hour >= 12 && hour < 18 ? t('greeting', 'afternoon') : t('greeting', 'evening');
  }, [t]);

  return (
    <div className={`h-full ${settings.highVisibility ? 'high-visibility' : ''} ${settings.playful ? 'playful' : ''}`}>
      {view === 'welcome' && <WelcomeScreen onStart={start} />}
      {/* Once shown, the board stays mounted (hidden) so a message in progress, the chosen category and page survive a visit to Help, Settings or the editor. */}
      {boardMounted.current && (
        <div hidden={view !== 'board'} className="h-full">
        <BoardScreen
          yourName={settings.yourName}
          savedPhrases={savedPhrases}
          customTiles={custom.tiles}
          speakOnTap={settings.speakOnTap}
          speaking={speech.speaking}
          spokenText={speech.spokenText}
          spokenCharIndex={speech.charIndex}
          wordPulse={speech.wordPulse}
          onSpeak={speech.speak}
          onStop={speech.stop}
          onSavePhrase={(phrase) => {
            const next = savePhrase(savedPhrases, phrase, TILES_PER_PAGE);
            const saved = next.some((p) => p.toLowerCase() === phrase.trim().toLowerCase());
            if (saved) setSavedPhrases(next);
            return saved;
          }}
          onHelp={() => open('help')}
          onSettings={() => open('settings')}
        />
        </div>
      )}
      {view === 'help' && (
        <HelpScreen
          contacts={emergency.contacts}
          yourName={settings.yourName}
          onSpeak={speech.speak}
          onClose={back}
          onSetUpContacts={() => open('settings', { replace: true })}
        />
      )}
      {view === 'settings' && (
        <SettingsScreen
          settings={settings}
          voices={speech.voices}
          speechSupported={speech.supported}
          savedPhrases={savedPhrases}
          customTiles={custom.tiles}
          contacts={emergency.contacts}
          onSaveContact={emergency.saveContact}
          onRemoveContact={emergency.removeContact}
          onAddTile={() => {
            setEditingTileId(null);
            open('tile-editor');
          }}
          onEditTile={(id) => {
            setEditingTileId(id);
            open('tile-editor');
          }}
          onUpdate={update}
          onTestVoice={() => speech.speak(testVoiceMessage)}
          onRemovePhrase={(phrase) => setSavedPhrases((prev) => prev.filter((p) => p !== phrase))}
          onBack={back}
          updateReady={updateReady}
          offlineReady={offlineReady}
          onApplyUpdate={onApplyUpdate}
          onRestore={onRestore}
          onReplayWelcome={onReplayWelcome}
        />
      )}
      {view === 'tile-editor' && (
        <TileEditorScreen
          key={editingTileId ?? 'new'}
          tile={custom.tiles.find((t) => t.id === editingTileId)}
          onSave={(tile) => {
            const isNew = !custom.tiles.some((t) => t.id === tile.id);
            const ok = custom.saveTile(tile);
            if (ok && isNew) record('customTilesAdded');
            return ok;
          }}
          onDelete={custom.removeTile}
          onSpeak={speech.speak}
          onClose={back}
        />
      )}
    </div>
  );
}
