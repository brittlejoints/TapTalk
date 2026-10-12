import { useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DEFAULT_SAVED_PHRASES, TILES_PER_PAGE } from './data/vocabulary';
import { useEmergencyContacts } from './lib/contacts';
import { useCustomTiles } from './lib/customTiles';
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
  const speech = useSpeech(settings.voiceURI, settings.rate);
  const custom = useCustomTiles();
  const emergency = useEmergencyContacts();
  const [editingTileId, setEditingTileId] = useState<string | null>(null);
  const [view, setView] = useState<View>(() =>
    loadJSON('onboarded', false, isBoolean) ? 'board' : 'welcome',
  );
  const [savedPhrases, setSavedPhrases] = useState<string[]>(() =>
    loadJSON('saved-phrases', DEFAULT_SAVED_PHRASES, isStringArray),
  );

  useEffect(() => {
    saveJSON('saved-phrases', savedPhrases);
  }, [savedPhrases]);

  const start = () => {
    saveJSON('onboarded', true);
    setView('board');
  };

  return (
    <ErrorBoundary>
    <div className={`h-full ${settings.highVisibility ? 'high-visibility' : ''} ${settings.playful ? 'playful' : ''}`}>
      {view === 'welcome' && <WelcomeScreen onStart={start} />}
      {view === 'board' && (
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
          onTestVoice={() => speech.speak('Hi! This is how I will sound.')}
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
    </ErrorBoundary>
  );
}
