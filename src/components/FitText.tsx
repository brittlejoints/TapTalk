import { useLayoutEffect, useRef, type ReactNode } from 'react';

/**
 * Shrinks the text a pixel at a time until the longest word fits its box, so a
 * word is never cut off at larger text sizes or in longer languages. The size
 * only goes down from what CSS asks for, and never below `minSize`.
 */
export function FitText({ children, className = '', minSize = 13 }: { children: ReactNode; className?: string; minSize?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      el.style.fontSize = '';
      el.style.overflowWrap = '';
      let size = parseFloat(getComputedStyle(el).fontSize);
      while (el.scrollWidth > el.clientWidth + 0.5 && size > minSize) {
        size -= 1;
        el.style.fontSize = `${size}px`;
      }
      // Last resort for a very long single word: break it instead of cutting it off.
      if (el.scrollWidth > el.clientWidth + 0.5) el.style.overflowWrap = 'anywhere';
    };
    fit();
    void document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [children, minSize]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
