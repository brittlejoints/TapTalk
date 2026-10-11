import type { LucideIcon } from 'lucide-react';
import type { TileColorId } from './colors';
import {
  Angry, Annoyed, Bandage, Bath, Bed, Coffee, Droplet, Flame, Frown, Ghost,
  GraduationCap, Hand, Heart, HeartHandshake, HeartPulse, Laugh, LifeBuoy,
  Moon, Pill, RotateCw, Smile, Snowflake, Star, Stethoscope, Syringe,
  Thermometer, ThumbsUp, User, UserRound, Users, Utensils, Wind, Zap,
} from 'lucide-react';

export type CategoryId = 'saved' | 'needs' | 'feelings' | 'people' | 'medical';

export interface Word {
  label: string;
  icon?: LucideIcon;
  /** A data URL, for custom tiles with a photo. Shown instead of the icon. */
  photo?: string;
  /** Overrides the category color (custom tiles). */
  color?: TileColorId;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  /** Default tile color for this category (Fitzgerald-inspired where it fits). */
  color: TileColorId;
  words: Word[];
}

/**
 * Boards show 9 tiles in a fixed 3x3 grid so positions never move. Categories
 * have 8 built-in words; slot 9 is reserved for "My words" (see boardPages.ts).
 */
export const TILES_PER_PAGE = 9;

export const CATEGORIES: Category[] = [
  {
    id: 'saved',
    label: 'Saved',
    icon: Star,
    color: 'keylime',
    words: [], // filled from the user's saved phrases
  },
  {
    id: 'needs',
    label: 'Needs',
    icon: Coffee,
    color: 'peach',
    words: [
      { label: 'I want', icon: Hand },
      { label: 'I need', icon: LifeBuoy },
      { label: 'Water', icon: Droplet },
      { label: 'Food', icon: Utensils },
      { label: 'Bathroom', icon: Bath },
      { label: 'Hot', icon: Flame },
      { label: 'Cold', icon: Snowflake },
      { label: 'Pain', icon: Zap },
    ],
  },
  {
    id: 'feelings',
    label: 'Feelings',
    icon: Smile,
    color: 'mist',
    words: [
      { label: 'Happy', icon: Smile },
      { label: 'Sad', icon: Frown },
      { label: 'Worried', icon: Annoyed },
      { label: 'Angry', icon: Angry },
      { label: 'Scared', icon: Ghost },
      { label: 'Tired', icon: Moon },
      { label: 'Excited', icon: Laugh },
      { label: 'Okay', icon: ThumbsUp },
    ],
  },
  {
    id: 'people',
    label: 'People',
    icon: Users,
    color: 'butter',
    words: [
      { label: 'Me', icon: User },
      { label: 'You', icon: UserRound },
      { label: 'Mom', icon: Heart },
      { label: 'Dad', icon: Heart },
      { label: 'Friend', icon: Users },
      { label: 'Teacher', icon: GraduationCap },
      { label: 'Nurse', icon: Stethoscope },
      { label: 'Caregiver', icon: HeartHandshake },
    ],
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: HeartPulse,
    color: 'lilac',
    words: [
      { label: 'Medicine', icon: Pill },
      { label: 'It hurts', icon: Zap },
      { label: 'Sick', icon: Thermometer },
      { label: 'Dizzy', icon: RotateCw },
      { label: "Can't breathe", icon: Wind },
      { label: 'Bandage', icon: Bandage },
      { label: 'Shot', icon: Syringe },
      { label: 'Rest', icon: Bed },
    ],
  },
];

/** Starter phrases for the Saved page until the user saves their own. */
export const DEFAULT_SAVED_PHRASES = [
  'I need help',
  'Thank you',
  'All done',
  'Please wait',
  "I don't understand",
  'Say it again',
  'I love you',
  'Not now',
  'Good morning',
];
