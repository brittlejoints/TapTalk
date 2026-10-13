import { TILES_PER_PAGE } from '../data/vocabulary';
import { parseContacts, type EmergencyContact } from './contacts';
import { parseCustomTiles, type CustomTile } from './customTiles';
import { normalizeSettings, type Settings } from './settings';

/**
 * A backup file: everything a person has set up, so a family can move to a new
 * device or recover after clearing the browser. Plain JSON, not encrypted.
 */
export const BACKUP_VERSION = 1;

export interface BackupData {
  /** The device's own voice choice is left out: voices differ between devices. */
  settings: Omit<Settings, 'voiceURI'>;
  customTiles: CustomTile[];
  savedPhrases: string[];
  contacts: EmergencyContact[];
}

export type BackupProblem = 'not-backup' | 'too-new' | 'too-big';

/**
 * Largest file restore will read. A real backup comes from browser storage
 * (about 5 MB at most), so anything bigger isn't one; checking the size first
 * means a huge file is refused before it is loaded into memory.
 */
export const MAX_BACKUP_BYTES = 8 * 1024 * 1024;

export function backupSizeProblem(bytes: number): BackupProblem | null {
  return bytes > MAX_BACKUP_BYTES ? 'too-big' : null;
}

export function buildBackup(data: BackupData, now = new Date()): string {
  return JSON.stringify({ app: 'tap-talk', version: BACKUP_VERSION, exportedAt: now.toISOString(), ...data }, null, 2);
}

export function backupFileName(now = new Date()): string {
  return `tap-talk-backup-${now.toISOString().slice(0, 10)}.json`;
}

/** Reads a backup file's text. Valid entries are kept; anything damaged is dropped, never trusted. */
export function parseBackup(text: string): { ok: true; data: BackupData } | { ok: false; problem: BackupProblem } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, problem: 'not-backup' };
  }
  if (typeof raw !== 'object' || raw === null) return { ok: false, problem: 'not-backup' };
  const v = raw as Record<string, unknown>;
  if (v.app !== 'tap-talk' || typeof v.version !== 'number') return { ok: false, problem: 'not-backup' };
  if (v.version > BACKUP_VERSION) return { ok: false, problem: 'too-new' };

  const { voiceURI: _voice, ...settings } = normalizeSettings(v.settings);
  const savedPhrases = (Array.isArray(v.savedPhrases) ? v.savedPhrases : [])
    .filter((p): p is string => typeof p === 'string' && p.trim().length > 0)
    .map((p) => p.trim())
    .slice(0, TILES_PER_PAGE);

  return {
    ok: true,
    data: { settings, customTiles: parseCustomTiles(v.customTiles), savedPhrases, contacts: parseContacts(v.contacts) },
  };
}
