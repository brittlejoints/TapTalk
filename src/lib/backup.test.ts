import { describe, expect, it } from 'vitest';
import { MAX_BACKUP_BYTES, backupFileName, backupSizeProblem, buildBackup, parseBackup, type BackupData } from './backup';
import { DEFAULT_SETTINGS } from './settings';

const { voiceURI: _voice, ...settings } = { ...DEFAULT_SETTINGS, yourName: 'Sam', language: 'es-ES' as const };

const data: BackupData = {
  settings,
  customTiles: [{ id: 't1', label: 'Abuela', category: 'people', color: 'peach', icon: 'star' }],
  savedPhrases: ['Gracias', 'Ahora no'],
  contacts: [{ id: 'c1', name: 'Mamá', phone: '5550102345', relationship: 'Madre' }],
};

describe('backup', () => {
  it('refuses files bigger than any real backup, before reading them', () => {
    expect(backupSizeProblem(MAX_BACKUP_BYTES + 1)).toBe('too-big');
    expect(backupSizeProblem(MAX_BACKUP_BYTES)).toBeNull();
    expect(backupSizeProblem(new TextEncoder().encode(buildBackup(data)).length)).toBeNull();
  });

  it('round-trips everything', () => {
    const parsed = parseBackup(buildBackup(data));
    expect(parsed).toEqual({ ok: true, data });
  });

  it('never includes the device voice', () => {
    expect(buildBackup(data)).not.toContain('voiceURI');
  });

  it('rejects files that are not Tap Talk backups', () => {
    for (const text of ['nope', '[]', '"x"', '{}', '{"app":"other","version":1}', '{"app":"tap-talk"}']) {
      expect(parseBackup(text)).toEqual({ ok: false, problem: 'not-backup' });
    }
  });

  it('rejects a backup from a newer version', () => {
    expect(parseBackup('{"app":"tap-talk","version":99}')).toEqual({ ok: false, problem: 'too-new' });
  });

  it('drops damaged entries and keeps the good ones', () => {
    const text = JSON.stringify({
      app: 'tap-talk',
      version: 1,
      customTiles: [data.customTiles[0], { label: 5 }, null],
      contacts: [data.contacts[0], { id: 'x', name: 'No phone', phone: '12', relationship: '' }],
      savedPhrases: ['  Hola  ', '', 7, 'Adiós'],
      settings: { textSize: 'huge', language: 'es-ES' },
    });
    const parsed = parseBackup(text);
    expect(parsed.ok && parsed.data.customTiles).toHaveLength(1);
    expect(parsed.ok && parsed.data.contacts).toHaveLength(1);
    expect(parsed.ok && parsed.data.savedPhrases).toEqual(['Hola', 'Adiós']);
    expect(parsed.ok && parsed.data.settings.textSize).toBe('medium');
    expect(parsed.ok && parsed.data.settings.language).toBe('es-ES');
  });

  it('caps saved phrases at one page', () => {
    const many = Array.from({ length: 20 }, (_, i) => `p${i}`);
    const parsed = parseBackup(JSON.stringify({ app: 'tap-talk', version: 1, savedPhrases: many }));
    expect(parsed.ok && parsed.data.savedPhrases).toHaveLength(9);
  });

  it('names the file with the date', () => {
    expect(backupFileName(new Date('2026-10-13T12:00:00Z'))).toBe('tap-talk-backup-2026-10-13.json');
  });
});
