import { useEffect, useState } from 'react';
import { loadJSON, saveJSON } from './storage';

export interface Settings {
  /** Speak each tile as soon as it is tapped, instead of building a message first. */
  speakOnTap: boolean;
  /** Outline tiles and core buttons for users who need clearer edges. */
  highVisibility: boolean;
  voiceURI: string | null;
  rate: number;
}

export const DEFAULT_SETTINGS: Settings = {
  speakOnTap: false,
  highVisibility: false,
  voiceURI: null,
  rate: 1,
};

function isSettings(value: unknown): value is Settings {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.speakOnTap === 'boolean' &&
    typeof v.highVisibility === 'boolean' &&
    (v.voiceURI === null || typeof v.voiceURI === 'string') &&
    typeof v.rate === 'number' &&
    v.rate >= 0.5 &&
    v.rate <= 2
  );
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() =>
    loadJSON('settings', DEFAULT_SETTINGS, isSettings),
  );

  useEffect(() => {
    saveJSON('settings', settings);
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch }));

  return { settings, update };
}
