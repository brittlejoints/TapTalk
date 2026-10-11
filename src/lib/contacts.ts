import { useState } from 'react';
import { loadJSON, saveJSON } from './storage';

/**
 * Emergency contacts, stored only on this device.
 *
 * Not encrypted: any key would have to live in the app's own code, which
 * protects nothing (the Make prototype did this). Real protection needs the
 * device's own security, which comes with an installed native app.
 */
export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
}

export const MAX_CONTACTS = 5;

/** Keeps a leading + and digits only, so "(555) 010-2345" becomes "5550102345". */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, '');
  return trimmed.startsWith('+') ? `+${digits}` : digits;
}

/** Returns an error message, or null when the phone number looks usable. */
export function phoneError(input: string): string | null {
  const digits = normalizePhone(input).replace('+', '');
  if (!digits) return 'Add a phone number.';
  if (digits.length < 7 || digits.length > 15) return 'Check the phone number. It should have 7 to 15 digits.';
  return null;
}

function isContact(value: unknown): value is EmergencyContact {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as Record<string, unknown>;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    c.name.trim().length > 0 &&
    typeof c.phone === 'string' &&
    phoneError(c.phone) === null &&
    typeof c.relationship === 'string'
  );
}

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() =>
    loadJSON<unknown[]>('emergency-contacts', [], Array.isArray).filter(isContact).slice(0, MAX_CONTACTS),
  );

  const persist = (next: EmergencyContact[]): boolean => {
    if (!saveJSON('emergency-contacts', next)) return false;
    setContacts(next);
    return true;
  };

  const saveContact = (contact: EmergencyContact): boolean => {
    const exists = contacts.some((c) => c.id === contact.id);
    return persist(exists ? contacts.map((c) => (c.id === contact.id ? contact : c)) : [...contacts, contact]);
  };

  const removeContact = (id: string) => persist(contacts.filter((c) => c.id !== id));

  return { contacts, saveContact, removeContact };
}
