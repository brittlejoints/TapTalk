import { Component, type ErrorInfo, type ReactNode } from 'react';
import { TippedPotIllustration } from './illustrations';

/**
 * Catches any crash in the app and shows a friendly recovery screen instead
 * of a blank page. "Reload" uses the service worker's cached files, so Tap
 * Talk still opens offline.
 */
interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Shown in dev consoles for debugging; nothing is sent anywhere.
    console.error('Tap Talk crashed:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  reload = () => window.location.reload();

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-[14px] px-6 py-10 text-center">
        <TippedPotIllustration className="size-28 text-forest" />
        <h1 className="font-display text-title leading-tight font-light text-forest">Something went wrong.</h1>
        <p className="text-charcoal">
          Tap Talk ran into an error. Your words and settings are still saved on this device.
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={this.reset}
            className="pressable h-14 rounded-tile bg-forest text-[17px] font-medium text-cream"
          >
            Try again
          </button>
          <button type="button" onClick={this.reload} className="h-12 rounded-tile bg-hairline font-medium text-forest">
            Reload the app
          </button>
        </div>
      </main>
    );
  }
}
