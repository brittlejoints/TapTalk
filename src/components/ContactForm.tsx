import { useId, useState } from 'react';
import { normalizePhone, phoneError, type EmergencyContact } from '../lib/contacts';

interface ContactFormProps {
  contact?: EmergencyContact;
  onSave: (contact: EmergencyContact) => boolean;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

const inputClass = 'h-12 rounded-tile bg-cream px-3.5 text-[17px] text-charcoal placeholder:text-muted';

/** Add or edit one emergency contact, inline in Settings. */
export function ContactForm({ contact, onSave, onDelete, onCancel }: ContactFormProps) {
  const [name, setName] = useState(contact?.name ?? '');
  const [phone, setPhone] = useState(contact?.phone ?? '');
  const [relationship, setRelationship] = useState(contact?.relationship ?? '');
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const id = useId();

  const save = () => {
    if (!name.trim()) return setError('Add a name.');
    const problem = phoneError(phone);
    if (problem) return setError(problem);
    const ok = onSave({
      id: contact?.id ?? crypto.randomUUID(),
      name: name.trim(),
      phone: normalizePhone(phone),
      relationship: relationship.trim(),
    });
    if (!ok) setError('Couldn’t save: this device’s storage is full.');
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-tile bg-cream/60 p-3">
      <label htmlFor={`${id}-name`} className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest">Name</span>
        <input id={`${id}-name`} className={inputClass} value={name} maxLength={60} onChange={(e) => setName(e.target.value)} placeholder="For example: Mom" autoComplete="off" />
      </label>
      <label htmlFor={`${id}-phone`} className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest">Mobile number</span>
        <input id={`${id}-phone`} className={inputClass} value={phone} type="tel" inputMode="tel" maxLength={24} onChange={(e) => setPhone(e.target.value)} placeholder="Include the country code if abroad" autoComplete="off" />
      </label>
      <label htmlFor={`${id}-rel`} className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest">Relationship (optional)</span>
        <input id={`${id}-rel`} className={inputClass} value={relationship} maxLength={40} onChange={(e) => setRelationship(e.target.value)} placeholder="Parent, caregiver, neighbor…" autoComplete="off" />
      </label>

      {error && (
        <p role="alert" className="rounded-tile bg-hairline px-3 py-2 text-sm font-medium text-charcoal">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onCancel} className="h-12 rounded-tile bg-hairline font-medium text-forest">
          Cancel
        </button>
        <button type="button" onClick={save} className="pressable h-12 rounded-tile bg-forest font-medium text-cream">
          Save contact
        </button>
      </div>

      {contact && onDelete &&
        (confirmingDelete ? (
          <div role="group" aria-label="Confirm remove" className="flex flex-col gap-2 rounded-tile bg-hairline p-3">
            <p className="text-sm font-medium text-charcoal">Remove {contact.name} from emergency contacts?</p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setConfirmingDelete(false)} className="h-11 rounded-tile bg-cream font-medium text-forest">
                Keep
              </button>
              <button type="button" onClick={() => onDelete(contact.id)} className="h-11 rounded-tile bg-charcoal font-medium text-cream">
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmingDelete(true)} className="h-11 text-sm font-medium text-forest underline underline-offset-4">
            Remove this contact
          </button>
        ))}
    </div>
  );
}
