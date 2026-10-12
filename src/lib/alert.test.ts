import { describe, expect, it } from 'vitest';
import { buildAlertMessage, buildSmsUrl, detectPlatform } from './alert';
import { normalizePhone, phoneError } from './contacts';
import { DEFAULT_CORE_SLOTS } from './coreWords';
import { normalizeSettings } from './settings';

describe('buildAlertMessage', () => {
  it('includes the name, what was said, and a map link', () => {
    const msg = buildAlertMessage({ name: 'Sam', said: "Can't breathe", location: { latitude: 40.7128, longitude: -74.006 } });
    expect(msg).toContain('EMERGENCY: Sam needs help.');
    expect(msg).toContain('They said: "Can\'t breathe"');
    expect(msg).toContain('https://maps.google.com/?q=40.71280,-74.00600');
  });

  it('is honest when there is no name or location', () => {
    const msg = buildAlertMessage({ name: ' ', said: null, location: null });
    expect(msg).toContain('Someone using Tap Talk needs help.');
    expect(msg).toContain('Location: not available.');
    expect(msg).not.toContain('They said');
  });
});

describe('buildSmsUrl', () => {
  it('uses iOS syntax for multiple recipients', () => {
    expect(buildSmsUrl(['+15550100', '5550101'], 'Help me', 'ios')).toBe('sms:+15550100,5550101&body=Help%20me');
  });

  it('uses Android syntax elsewhere', () => {
    expect(buildSmsUrl(['+15550100', '5550101'], 'Help me', 'other')).toBe('sms:+15550100;5550101?body=Help%20me');
  });
});

describe('detectPlatform', () => {
  it('treats iPhones and touch Macs (iPads) as iOS', () => {
    expect(detectPlatform({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0)', maxTouchPoints: 5 })).toBe('ios');
    expect(detectPlatform({ userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X)', maxTouchPoints: 5 })).toBe('ios');
    expect(detectPlatform({ userAgent: 'Mozilla/5.0 (Linux; Android 14)', maxTouchPoints: 5 })).toBe('other');
  });
});

describe('phone numbers', () => {
  it('normalizes formatting and keeps a leading +', () => {
    expect(normalizePhone('(555) 010-2345')).toBe('5550102345');
    expect(normalizePhone(' +44 20 7946 0958 ')).toBe('+442079460958');
  });

  it('rejects numbers that are empty, too short or too long', () => {
    expect(phoneError('')).toMatch(/Add a phone/);
    expect(phoneError('12345')).toMatch(/7 to 15/);
    expect(phoneError('555 010 2345')).toBeNull();
  });
});

describe('normalizeSettings', () => {
  it('keeps valid saved values and fills new fields with defaults', () => {
    const s = normalizeSettings({ speakOnTap: true, highVisibility: true, voiceURI: null, rate: 1.2 });
    expect(s).toEqual({ speakOnTap: true, highVisibility: true, voiceURI: null, rate: 1.2, yourName: '', playful: true, language: 'en-US', textSize: 'medium', coreWords: DEFAULT_CORE_SLOTS });
  });

  it('recovers from junk', () => {
    expect(normalizeSettings('nope').rate).toBe(1);
  });
});
