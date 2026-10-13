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

export type PhoneProblem = 'missing' | 'length';

/** What is wrong with a phone number, or null when it looks usable. The screen translates the problem. */
export function phoneProblem(input: string): PhoneProblem | null {
  const digits = normalizePhone(input).replace('+', '');
  if (!digits) return 'missing';
  if (digits.length < 7 || digits.length > 15) return 'length';
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
    phoneProblem(c.phone) === null &&
    typeof c.relationship === 'string'
  );
}

/** Keeps every valid contact (at most MAX_CONTACTS). */
export function parseContacts(raw: unknown): EmergencyContact[] {
  return Array.isArray(raw) ? raw.filter(isContact).slice(0, MAX_CONTACTS) : [];
}

export function useEmergencyContacts() {
  const [contacts, setContacts] = useState<EmergencyContact[]>(() =>
    parseContacts(loadJSON<unknown[]>('emergency-contacts', [], Array.isArray)),
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

  const replaceContacts = (next: EmergencyContact[]): boolean => persist(next);

  return { contacts, saveContact, removeContact, replaceContacts };
}
