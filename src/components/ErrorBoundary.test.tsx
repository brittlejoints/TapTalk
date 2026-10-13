import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { STRINGS } from '../data/strings';
import { ErrorBoundary } from './ErrorBoundary';

function Bomb(): never {
  throw new Error('boom');
}

function renderCrash(language: string | null) {
  localStorage.clear();
  if (language) localStorage.setItem('tap-talk:settings', JSON.stringify({ language }));
  const host = document.createElement('div');
  (globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  act(() => {
    createRoot(host).render(
      <ErrorBoundary>
        <Bomb />
      </ErrorBoundary>,
    );
  });
  return host.textContent ?? '';
}

describe('ErrorBoundary', () => {
  afterEach(() => vi.restoreAllMocks());

  it('shows the crash screen in the saved language', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(renderCrash('es-ES')).toContain(STRINGS['es-ES'].error.title);
    expect(renderCrash('en-US')).toContain(STRINGS['en-US'].error.title);
  });

  it('falls back to English when nothing is saved', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(renderCrash(null)).toContain(STRINGS['en-US'].error.reload);
  });
});
