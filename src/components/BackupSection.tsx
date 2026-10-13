import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import { backupFileName, buildBackup, parseBackup, type BackupData } from '../lib/backup';
import { useI18n } from '../lib/i18n';

interface BackupSectionProps {
  /** The current data on this device. */
  current: BackupData;
  /** Replaces what is on this device. Returns false if storage ran out. */
  onRestore: (data: BackupData) => boolean;
}

/** Save everything to a file, or restore from one. Nothing is replaced until the user confirms. */
export function BackupSection({ current, onRestore }: BackupSectionProps) {
  const { t } = useI18n();
  const fileInput = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<BackupData | null>(null);
  const [note, setNote] = useState<{ text: string; problem: boolean } | null>(null);

  const exportFile = () => {
    const name = backupFileName();
    const url = URL.createObjectURL(new Blob([buildBackup(current)], { type: 'application/json' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    // The browser doesn't tell us the save finished, so this only says it should be happening.
    setNote({ text: t('backup', 'exported').replace('{file}', name), problem: false });
  };

  const chooseFile = async (file: File | undefined) => {
    if (!file) return;
    setNote(null);
    setPending(null);
    const result = parseBackup(await file.text().catch(() => ''));
    if (result.ok) setPending(result.data);
    else setNote({ text: t('backup', result.problem === 'too-new' ? 'too-new' : 'not-backup'), problem: true });
  };

  const confirm = () => {
    if (!pending) return;
    const ok = onRestore(pending);
    setPending(null);
    setNote({ text: t('backup', ok ? 'restored' : 'err-storage'), problem: !ok });
  };

  return (
    <>
      <p className="-mt-1 text-sm text-muted">{t('backup', 'hint')}</p>
      <div className="grid gap-2">
        <button type="button" onClick={exportFile} className="pressable inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-forest font-medium text-cream">
          <Download size={20} aria-hidden="true" />
          {t('backup', 'export')}
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex h-12 items-center justify-center gap-2 rounded-tile bg-cream font-medium text-forest">
          <Upload size={20} aria-hidden="true" />
          {t('backup', 'import')}
        </button>
        <input
          ref={fileInput}
          type="file"
          accept=".json,application/json"
          className="hidden"
          aria-label={t('backup', 'import')}
          onChange={(e) => {
            void chooseFile(e.target.files?.[0]);
            e.target.value = '';
          }}
        />
      </div>

      {pending && (
        <div role="group" aria-label={t('backup', 'confirm-title')} className="flex flex-col gap-2 rounded-tile bg-hairline p-[14px]">
          <p className="font-semibold text-charcoal">{t('backup', 'confirm-title')}</p>
          <p className="text-sm text-charcoal">
            {t('backup', 'confirm-body')
              .replace('{tiles}', String(pending.customTiles.length))
              .replace('{contacts}', String(pending.contacts.length))
              .replace('{phrases}', String(pending.savedPhrases.length))}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setPending(null)} className="h-12 rounded-tile bg-cream font-medium text-forest">
              {t('backup', 'cancel')}
            </button>
            <button type="button" onClick={confirm} className="h-12 rounded-tile bg-charcoal font-medium text-cream">
              {t('backup', 'replace')}
            </button>
          </div>
        </div>
      )}

      {note && (
        <p role={note.problem ? 'alert' : 'status'} className="rounded-tile bg-cream px-3 py-2 text-sm font-medium text-charcoal">
          {note.text}
        </p>
      )}
    </>
  );
}
