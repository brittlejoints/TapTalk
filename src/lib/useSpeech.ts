import { useCallback, useEffect, useState } from 'react';

/**
 * Text-to-speech through the browser's built-in voices. It works offline and
 * the text never leaves the device.
 *
 * One utterance at a time (a new message replaces the old one), and the user
 * picks their own voice in Settings.
 *
 * Word boundary events (supported by most voices) drive the word-by-word
 * highlight in the message bar and the wordmark's talking bars.
 */
export function useSpeech(voiceURI: string | null, rate: number) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  /** The text currently being spoken, so callers can match it to what's on screen. */
  const [spokenText, setSpokenText] = useState<string | null>(null);
  /** Character index of the word being spoken, or null between words/utterances. */
  const [charIndex, setCharIndex] = useState<number | null>(null);
  /** Increments once per spoken word (and once at the start). */
  const [wordPulse, setWordPulse] = useState(0);

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    // Chrome and Edge load voices asynchronously.
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = voices.find((v) => v.voiceURI === voiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      }
      utterance.rate = rate;
      const finish = () => {
        setSpeaking(false);
        setSpokenText(null);
        setCharIndex(null);
      };
      utterance.onstart = () => {
        setSpeaking(true);
        setSpokenText(text);
        setCharIndex(0);
        setWordPulse((n) => n + 1);
      };
      utterance.onboundary = (e) => {
        if (e.name && e.name !== 'word') return;
        setCharIndex(e.charIndex);
        if (e.charIndex > 0) setWordPulse((n) => n + 1);
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      synth.speak(utterance);
    },
    [supported, voices, voiceURI, rate],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpokenText(null);
    setCharIndex(null);
  }, [supported]);

  return { supported, voices, speaking, spokenText, charIndex, wordPulse, speak, stop };
}

/** Which word of `words` (joined by spaces) contains character `charIndex`. */
export function wordIndexAt(words: string[], charIndex: number): number {
  let start = 0;
  for (let i = 0; i < words.length; i++) {
    const end = start + words[i].length;
    if (charIndex < end + 1) return i;
    start = end + 1;
  }
  return words.length - 1;
}
