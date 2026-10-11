/**
 * Builds emergency alerts that open the phone's own Messages app, ready to send.
 * Tap Talk never sends anything by itself, so the user always taps Send.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export function buildAlertMessage(opts: { name: string; said: string | null; location: Coordinates | null }): string {
  const who = opts.name.trim() || 'Someone using Tap Talk';
  const lines = [`EMERGENCY: ${who} needs help.`];
  if (opts.said) lines.push(`They said: "${opts.said}"`);
  if (opts.location) {
    const lat = opts.location.latitude.toFixed(5);
    const lng = opts.location.longitude.toFixed(5);
    lines.push(`Location: https://maps.google.com/?q=${lat},${lng}`);
  } else {
    lines.push('Location: not available.');
  }
  lines.push('Sent from Tap Talk. Please call or come now.');
  return lines.join('\n');
}

export type Platform = 'ios' | 'other';

export function detectPlatform(nav: Pick<Navigator, 'userAgent' | 'maxTouchPoints'> = navigator): Platform {
  const ua = nav.userAgent;
  // iPadOS reports itself as a Mac, so check for touch support too.
  const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && nav.maxTouchPoints > 1);
  return isIOS ? 'ios' : 'other';
}

/**
 * An sms: link with several recipients and a prefilled message.
 * iOS separates recipients with commas and uses "&body="; Android uses
 * semicolons and "?body=".
 */
export function buildSmsUrl(phones: string[], body: string, platform: Platform): string {
  const encoded = encodeURIComponent(body);
  return platform === 'ios'
    ? `sms:${phones.join(',')}&body=${encoded}`
    : `sms:${phones.join(';')}?body=${encoded}`;
}

/** Asks for the current location. Resolves null if denied, unavailable or too slow. */
export function getLocation(timeoutMs = 8000): Promise<Coordinates | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
