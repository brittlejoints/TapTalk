import type { LucideIcon } from 'lucide-react';
import {
  Angry, Annoyed, Bandage, Bath, Coffee, Droplet, Flame, Frown, Ghost,
  GraduationCap, Hand, Heart, HeartHandshake, HeartPulse, Laugh, LifeBuoy,
  Moon, Pill, RotateCw, Smile, Snowflake, Star, Stethoscope, Syringe,
  Thermometer, ThumbsUp, User, UserRound, Users, Utensils, Wind, Zap,
} from 'lucide-react';
import type { TileColorId } from './colors';

export type CategoryId = 'saved' | 'needs' | 'feelings' | 'people' | 'medical';

export interface Word {
  /** The displayed label (translated), passed in by the board at render time. */
  label: string;
  icon?: LucideIcon;
  /** A data URL, for custom tiles with a photo. Shown instead of the icon. */
  photo?: string;
  /** An emoji, for custom tiles. Shown instead of the icon. */
  emoji?: string;
  /** Overrides the category color (custom tiles). */
  color?: TileColorId;
}

/** A translation key within a category section plus its icon. */
export interface WordDef {
  key: string;
  icon: LucideIcon;
}

export interface Category {
  id: CategoryId;
  icon: LucideIcon;
  /** Default tile color for this category (Fitzgerald-inspired where it fits). */
  color: TileColorId;
  /** Translation keys under strings.<id>. Empty for 'saved' (filled from the user's phrases). */
  words: WordDef[];
}

/**
 * Boards show 9 tiles in a fixed 3x3 grid so positions never move. Categories
 * have 8 built-in words; slot 9 is reserved for "My words" (see boardPages.ts).
 */
export const TILES_PER_PAGE = 9;

export const CATEGORIES: Category[] = [
  { id: 'saved', icon: Star, color: 'keylime', words: [] },
  {
    id: 'needs',
    icon: Coffee,
    color: 'peach',
    words: [
      { key: 'i-want', icon: Hand },
      { key: 'i-need', icon: LifeBuoy },
      { key: 'water', icon: Droplet },
      { key: 'food', icon: Utensils },
      { key: 'bathroom', icon: Bath },
      { key: 'hot', icon: Flame },
      { key: 'cold', icon: Snowflake },
      { key: 'pain', icon: Zap },
    ],
  },
  {
    id: 'feelings',
    icon: Smile,
    color: 'mist',
    words: [
      { key: 'happy', icon: Smile },
      { key: 'sad', icon: Frown },
      { key: 'worried', icon: Annoyed },
      { key: 'angry', icon: Angry },
      { key: 'scared', icon: Ghost },
      { key: 'tired', icon: Moon },
      { key: 'excited', icon: Laugh },
      { key: 'okay', icon: ThumbsUp },
    ],
  },
  {
    id: 'people',
    icon: Users,
    color: 'butter',
    words: [
      { key: 'me', icon: User },
      { key: 'you', icon: UserRound },
      { key: 'mom', icon: Heart },
      { key: 'dad', icon: Heart },
      { key: 'friend', icon: Users },
      { key: 'teacher', icon: GraduationCap },
      { key: 'nurse', icon: Stethoscope },
      { key: 'caregiver', icon: HeartHandshake },
    ],
  },
  {
    id: 'medical',
    icon: HeartPulse,
    color: 'lilac',
    words: [
      { key: 'medicine', icon: Pill },
      { key: 'it-hurts', icon: Zap },
      { key: 'sick', icon: Thermometer },
      { key: 'dizzy', icon: RotateCw },
      { key: 'cant-breathe', icon: Wind },
      { key: 'bandage', icon: Bandage },
      { key: 'shot', icon: Syringe },
      { key: 'rest', icon: Pill },
    ],
  },
];
