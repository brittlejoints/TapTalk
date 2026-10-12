import { Check, CircleCheck, Clock, Hand, HandHelping, Heart, Play, Plus, Repeat, X, type LucideIcon } from 'lucide-react';
import type { TileColorId } from './colors';

/** Words a quick-word slot can hold. Stored by id, so they translate with the language. Never rename or remove an id. */
export const CORE_WORD_IDS = ['yes', 'no', 'stop', 'more', 'wait', 'done', 'please', 'thanks', 'help', 'again', 'go'] as const;

export type CoreWordId = (typeof CORE_WORD_IDS)[number];

export const CORE_WORD_INFO: Record<CoreWordId, { icon: LucideIcon; color: TileColorId }> = {
  yes: { icon: Check, color: 'mint' },
  no: { icon: X, color: 'mist' },
  stop: { icon: Hand, color: 'sand' },
  more: { icon: Plus, color: 'sand' },
  wait: { icon: Clock, color: 'sand' },
  done: { icon: CircleCheck, color: 'mint' },
  please: { icon: Heart, color: 'butter' },
  thanks: { icon: Heart, color: 'butter' },
  help: { icon: HandHelping, color: 'lilac' },
  again: { icon: Repeat, color: 'sea' },
  go: { icon: Play, color: 'keylime' },
};
