import { useEffect, useState } from 'react';
import { DEFAULT_SAVED_PHRASES, TILES_PER_PAGE } from './data/vocabulary';
import { savePhrase } from './lib/message';
import { useSettings } from './lib/settings';
import { isStringArray, loadJSON, saveJSON } from './lib/storage';
import { useSpeech } from './lib/useSpeech';
import { BoardScreen } from './screens/BoardScreen';
import { HelpScreen } from './screens/HelpScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

type View = 'welcome' | 'board' | 'help' | 'settings';

const isBoolean = (v: unknown): v is boolean => typeof v === 'boolean';

export default function App() {
  const { settings, update } = useSettings();
  const speech = useSpeech(settings.voiceURI, settings.rate);
  const [view, setView] = useState<View>(() =>
    loadJSON('onboarded', false, isBoolean) ? 'board' : 'welcome',
  );
  const [savedPhrases, setSavedPhrases] = useState<string[]>(() =>
    loadJSON('saved-phrases', DEFAULT_SAVED_PHRASES, isStringArray),
  );

  useEffect(() => saveJSON('saved-phrases', savedPhrases), [savedPhrases]);

  const start = () => {
    saveJSON('onboarded', true);
    setView('board');
  };

  return (
    <div className={`h-full ${settings.highVisibility ? 'high-visibility' : ''}`}>
      {view === 'welcome' && <WelcomeScreen onStart={start} />}
      {view === 'board' && (
        <BoardScreen
          savedPhrases={savedPhrases}
          speakOnTap={settings.speakOnTap}
          speaking={speech.speaking}
          onSpeak={speech.speak}
          onStop={speech.stop}
          onSavePhrase={(phrase) => setSavedPhrases((prev) => savePhrase(prev, phrase, TILES_PER_PAGE))}
          onHelp={() => setView('help')}
          onSettings={() => setView('settings')}
        />
      )}
      {view === 'help' && <HelpScreen onSpeak={speech.speak} onClose={() => setView('board')} />}
      {view === 'settings' && (
        <SettingsScreen
          settings={settings}
          voices={speech.voices}
          speechSupported={speech.supported}
          savedPhrases={savedPhrases}
          onUpdate={update}
          onTestVoice={() => speech.speak('Hi! This is how I will sound.')}
          onRemovePhrase={(phrase) => setSavedPhrases((prev) => prev.filter((p) => p !== phrase))}
          onBack={() => setView('board')}
        />
      )}
    </div>
  );
}
