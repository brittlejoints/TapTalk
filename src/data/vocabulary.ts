import type { LucideIcon } from 'lucide-react';
import {
  Angry, Annoyed, Bandage, Bath, Bed, Coffee, Droplet, Flame, Frown, Ghost,
  GraduationCap, Hand, Heart, HeartHandshake, HeartPulse, House, Laugh, LifeBuoy,
  Meh, Moon, Pill, RotateCw, Smile, Snowflake, Star, Stethoscope, Syringe,
  Thermometer, ThumbsUp, User, UserRound, Users, Utensils, Wind, Zap,
} from 'lucide-react';

export type CategoryId = 'saved' | 'needs' | 'feelings' | 'people' | 'medical';

/** Surface tokens a category can use. Each maps to a Tailwind bg class. */
export type Surface = 'mint' | 'sage' | 'slate';

export interface Word {
  label: string;
  icon: LucideIcon;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: LucideIcon;
  surface: Surface;
  words: Word[];
}

/** Boards show 9 tiles in a fixed 3x3 grid so positions never move. */
export const TILES_PER_PAGE = 9;

export const CATEGORIES: Category[] = [
  {
    id: 'saved',
    label: 'Saved',
    icon: Star,
    surface: 'mint',
    words: [], // filled from the user's saved phrases
  },
  {
    id: 'needs',
    label: 'Needs',
    icon: Coffee,
    surface: 'sage',
    words: [
      { label: 'I want', icon: Hand },
      { label: 'I need', icon: LifeBuoy },
      { label: 'Water', icon: Droplet },
      { label: 'Food', icon: Utensils },
      { label: 'Bathroom', icon: Bath },
      { label: 'Sleep', icon: Bed },
      { label: 'Hot', icon: Flame },
      { label: 'Cold', icon: Snowflake },
      { label: 'Pain', icon: Zap },
    ],
  },
  {
    id: 'feelings',
    label: 'Feelings',
    icon: Smile,
    surface: 'slate',
    words: [
      { label: 'Happy', icon: Smile },
      { label: 'Sad', icon: Frown },
      { label: 'Worried', icon: Annoyed },
      { label: 'Angry', icon: Angry },
      { label: 'Scared', icon: Ghost },
      { label: 'Tired', icon: Moon },
      { label: 'Excited', icon: Laugh },
      { label: 'Bored', icon: Meh },
      { label: 'Okay', icon: ThumbsUp },
    ],
  },
  {
    id: 'people',
    label: 'People',
    icon: Users,
    surface: 'sage',
    words: [
      { label: 'Me', icon: User },
      { label: 'You', icon: UserRound },
      { label: 'Mom', icon: Heart },
      { label: 'Dad', icon: Heart },
      { label: 'Family', icon: House },
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
    surface: 'slate',
    words: [
      { label: 'Medicine', icon: Pill },
      { label: 'It hurts', icon: Zap },
      { label: 'Sick', icon: Thermometer },
      { label: 'Dizzy', icon: RotateCw },
      { label: "Can't breathe", icon: Wind },
      { label: 'Heart', icon: HeartPulse },
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

/** Static class names so Tailwind can find them at build time. */
export const SURFACE_CLASS: Record<Surface, string> = {
  mint: 'bg-mint',
  sage: 'bg-sage',
  slate: 'bg-slate',
};
