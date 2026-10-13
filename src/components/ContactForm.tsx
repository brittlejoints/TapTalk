import { useEffect, useId, useRef, useState } from 'react';
import { normalizePhone, phoneProblem, type EmergencyContact } from '../lib/contacts';
import { useI18n } from '../lib/i18n';

interface ContactFormProps {
  contact?: EmergencyContact;
  onSave: (contact: EmergencyContact) => boolean;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

const inputClass = 'h-12 rounded-tile bg-cream px-3.5 text-[17px] text-charcoal placeholder:text-muted';

/** Add or edit one emergency contact, inline in Settings. */
export function ContactForm({ contact, onSave, onDelete, onCancel }: ContactFormProps) {
  const { t } = useI18n();
  const [name, setName] = useState(contact?.name ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [relationship, setRelationship] = useState(contact?.relationship ?? '');
  const [error, setError] = useState<{ field: 'name' | 'phone' | null; text: string } | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const id = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);

  // The form opens on a tap, so start in the first field.
  useEffect(() => nameRef.current?.focus(), []);

  // A problem moves focus to the field it's about, where the error is read out with it.
  const fail = (field: 'name' | 'phone' | null, text: string) => {
    setError({ field, text });
    (field === 'name' ? nameRef : field === 'phone' ? phoneRef : null)?.current?.focus();
  };
  const invalid = (field: 'name' | 'phone') =>
    error?.field === field ? { 'aria-invalid': true, 'aria-describedby': `${id}-error` } : {};

  const save = () => {
    if (!name.trim()) return fail('name', t('contact', 'err-name'));
    const problem = phoneProblem(phone);
    if (problem) return fail('phone', t('contact', problem === 'missing' ? 'err-phone-missing' : 'err-phone-length'));
    const ok = onSave({
      id: contact?.id ?? crypto.randomUUID(),
      name: name.trim(),
      phone: normalizePhone(phone),
      relationship: relationship.trim(),
    });
    if (!ok) fail(null, t('contact', 'err-storage'));
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-tile bg-cream/60 p-3">
      <label htmlFor={`${id}-name`} className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest">{t('contact', 'name')}</span>
        <input ref={nameRef} {...invalid('name')} id={`${id}-name`} className={inputClass} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder={t('contact', 'name-placeholder')} autoComplete="off" />
      </label>
      <label htmlFor={`${id}-phone`} className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest">{t('contact', 'phone')}</span>
        <input ref={phoneRef} {...invalid('phone')} id={`${id}-phone`} className={inputClass} value={phone} type="tel" inputMode="tel" maxLength={24} onChange={(e) => setPhone(e.target.value)} placeholder={t('contact', 'phone-placeholder')} autoComplete="off" />
      </label>
      <label htmlFor={`${id}-rel`} className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest">{t('contact', 'relationship')}</span>
        <input id={`${id}-rel`} className={inputClass} value={relationship} maxLength={40} onChange={(e) => setRelationship(e.target.value)} placeholder={t('contact', 'relationship-placeholder')} autoComplete="off" />
      </label>

      {error && (
        <p id={`${id}-error`} role="alert" className="rounded-tile bg-hairline px-3 py-2 text-sm font-medium text-charcoal">
          {error.text}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCancel} className="h-12 rounded-tile bg-hairline font-medium text-forest">
          {t('contact', 'cancel')}
        </button>
        <button type="button" onClick={save} className="pressable h-12 rounded-tile bg-forest font-medium text-cream">
          {t('contact', 'save')}
        </button>
      </div>

      {contact && onDelete &&
        (confirmingDelete ? (
          <div role="group" aria-label={t('contact', 'confirm-remove-label')} className="flex flex-col gap-2 rounded-tile bg-hairline p-3">
            <p className="text-sm font-medium text-charcoal">{t('contact', 'remove-question').replace('{name}', contact.name)}</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmingDelete(false)} className="h-11 rounded-tile bg-cream font-medium text-forest">
                {t('contact', 'keep')}
              </button>
              <button type="button" onClick={() => onDelete(contact.id)} className="h-11 rounded-tile bg-charcoal font-medium text-cream">
                {t('contact', 'remove')}
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmingDelete(true)} className="h-11 text-sm font-medium text-forest underline underline-offset-4">
            {t('contact', 'remove-contact')}
          </button>
        ))}
    </div>
  );
}
