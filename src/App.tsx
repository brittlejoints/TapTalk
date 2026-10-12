import { useEffect, useMemo, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { STRINGS } from './data/strings';
import { TILES_PER_PAGE } from './data/vocabulary';
import { useEmergencyContacts } from './lib/contacts';
import { useCustomTiles } from './lib/customTiles';
import { I18nProvider, useI18n } from './lib/i18n';
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

  const start = () => {
    saveJSON('onboarded', true);
    setView('board');
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
          setView={setView}
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
        />
      </I18nProvider>
    </ErrorBoundary>
  );
}

interface ShellProps {
  view: View;
  setView: (v: View) => void;
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
}

/** Inside I18nProvider so screens can translate. The one `onTestVoice` message is translated here. */
function AppShell({ view, setView, start, settings, update, speech, custom, emergency, editingTileId, setEditingTileId, savedPhrases, setSavedPhrases }: ShellProps) {
  const { t } = useI18n();
  const testVoiceMessage = useMemo(() => {
    // Keep the voice test tied to the greeting language so the user hears their chosen voice.
    const hour = new Date().getHours();
    return hour >= 5 && hour < 12 ? t('greeting', 'morning') : hour >= 12 && hour < 18 ? t('greeting', 'afternoon') : t('greeting', 'evening');
  }, [t]);

  return (
    <div className={`h-full ${settings.highVisibility ? 'high-visibility' : ''} ${settings.playful ? 'playful' : ''}`}>
      {view === 'welcome' && <WelcomeScreen onStart={start} />}
      {view === 'board' && (
        <BoardScreen
          yourName={settings.yourName}
          savedPhrases={savedPhrases}
          coreWords={settings.coreWords}
          customTiles={custom.tiles}
          speakOnTap={settings.speakOnTap}
          speaking={speech.speaking}
          spokenText={speech.spokenText}
          spokenCharIndex={speech.charIndex}
          wordPulse={speech.wordPulse}
          onSpeak={speech.speak}
          onStop={speech.stop}
          onSavePhrase={(phrase) => setSavedPhrases((prev) => savePhrase(prev, phrase, TILES_PER_PAGE))}
          onHelp={() => setView('help')}
          onSettings={() => setView('settings')}
        />
      )}
      {view === 'help' && (
        <HelpScreen
          contacts={emergency.contacts}
          yourName={settings.yourName}
          onSpeak={speech.speak}
          onClose={() => setView('board')}
          onSetUpContacts={() => setView('settings')}
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
            setView('tile-editor');
          }}
          onEditTile={(id) => {
            setEditingTileId(id);
            setView('tile-editor');
          }}
          onUpdate={update}
          onTestVoice={() => speech.speak(testVoiceMessage)}
          onRemovePhrase={(phrase) => setSavedPhrases((prev) => prev.filter((p) => p !== phrase))}
          onBack={() => setView('board')}
        />
      )}
      {view === 'tile-editor' && (
        <TileEditorScreen
          key={editingTileId ?? 'new'}
          tile={custom.tiles.find((t) => t.id === editingTileId)}
          onSave={custom.saveTile}
          onDelete={custom.removeTile}
          onSpeak={speech.speak}
          onClose={() => setView('settings')}
        />
      )}
    </div>
  );
}
