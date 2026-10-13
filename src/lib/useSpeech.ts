import { useCallback, useEffect, useMemo, useState } from 'react';

/**
 * Text-to-speech through the browser's built-in voices. It works offline and
 * the text never leaves the device.
 *
 * One utterance at a time (a new message replaces the old one), and the user
 * picks their own voice in Settings. When `language` is given, we score voices
 * for the match and prefer ones for that language — otherwise the device would
 * read Spanish words with an English accent.
 */
let activeUtterance: SpeechSynthesisUtterance | null = null;

export function useSpeech(voiceURI: string | null, rate: number, language?: string) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [spokenText, setSpokenText] = useState<string | null>(null);
  const [charIndex, setCharIndex] = useState<number | null>(null);
  const [wordPulse, setWordPulse] = useState(0);

  useEffect(() => {
    if (!supported) return;
    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [supported]);

  /** Voices matching the current language come first; the user's picker shows the same filter. */
  const matchingVoices = useMemo(() => {
    if (!language) return voices;
    const base = language.toLowerCase().split('-')[0];
    const score = (v: SpeechSynthesisVoice) => {
      const l = v.lang.toLowerCase();
      if (l === language.toLowerCase()) return 2;
      if (l.startsWith(base + '-') || l === base) return 1;
      return 0;
    };
    return [...voices].sort((a, b) => score(b) - score(a));
  }, [voices, language]);

  const speak = useCallback(
    (text: string) => {
      if (!supported || !text.trim()) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      // Prefer the user's chosen voice, but fall back to one that matches the UI language.
      const chosen = voices.find((v) => v.voiceURI === voiceURI);
      const voice = chosen ?? matchingVoices[0];
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else if (language) {
        utterance.lang = language;
      }
      utterance.rate = rate;
      const finish = () => {
        if (activeUtterance === utterance) activeUtterance = null;
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
      // Chrome can drop an utterance's end event if nothing references it, leaving the app stuck on "speaking".
      activeUtterance = utterance;
      synth.speak(utterance);
    },
    [supported, voices, voiceURI, rate, language, matchingVoices],
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpokenText(null);
    setCharIndex(null);
  }, [supported]);

  return { supported, voices, matchingVoices, speaking, spokenText, charIndex, wordPulse, speak, stop };
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
