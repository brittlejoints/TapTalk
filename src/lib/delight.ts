/**
 * Small JavaScript-driven delights. Like the CSS ones, they run only when the
 * "Playful touches" setting is on AND the device allows motion.
 */

function playfulOn(): boolean {
  return document.querySelector('.playful') !== null;
}

export function motionAllowed(): boolean {
  return playfulOn() && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
}

/** A tiny tap on Android (iPhones don't support vibration). Part of playful touches. */
export function tapHaptic(): void {
  if (playfulOn() && 'vibrate' in navigator) navigator.vibrate(8);
}

const STAR_PATH =
  'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z';

/**
 * Flies a small star from a saved phrase's star button to the Saved tab, so
 * the user sees where the phrase went. The tab does a small hop on arrival.
 */
export function flyStarTo(from: Element, to: Element | null): void {
  if (!to || !motionAllowed()) return;
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const size = 22;
  const star = document.createElement('div');
  star.setAttribute('aria-hidden', 'true');
  star.style.cssText = `position:fixed;left:${a.left + a.width / 2 - size / 2}px;top:${a.top + a.height / 2 - size / 2}px;width:${size}px;height:${size}px;pointer-events:none;z-index:50;color:var(--color-forest)`;
  star.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}"><path d="${STAR_PATH}" fill="currentColor"/></svg>`;
  document.body.appendChild(star);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const flight = star.animate(
    [
      { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 46}px) scale(1.35) rotate(90deg)`, opacity: 1, offset: 0.45 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.5) rotate(200deg)`, opacity: 0.2 },
    ],
    { duration: 640, easing: 'cubic-bezier(0.3, 0.6, 0.3, 1)' },
  );
  flight.onfinish = () => {
    star.remove();
    to.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.14)' }, { transform: 'scale(1)' }], {
      duration: 260,
      easing: 'cubic-bezier(0.3, 1.5, 0.5, 1)',
    });
  };
}
