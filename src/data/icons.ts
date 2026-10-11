import type { LucideIcon } from 'lucide-react';
import {
  Apple, Baby, Bath, Bed, Bike, Book, Bus, Cake, Car, Cat, Coffee, CupSoda, Dog,
  Droplet, Gamepad2, Gift, Hand, Heart, House, IceCreamCone, Music, Pizza, School,
  Shirt, ShoppingCart, Smile, Star, Sun, TreePine, Tv, User, Users, Utensils,
} from 'lucide-react';

/**
 * Icons a custom tile can use. Custom tiles store the name (a string), because
 * icon components can't be saved to storage; this map turns the name back
 * into a component.
 */
export const TILE_ICONS = {
  star: Star, heart: Heart, smile: Smile, hand: Hand, user: User, users: Users,
  baby: Baby, house: House, school: School, utensils: Utensils, apple: Apple,
  pizza: Pizza, 'ice-cream': IceCreamCone, cake: Cake, coffee: Coffee, drink: CupSoda,
  water: Droplet, bath: Bath, bed: Bed, shirt: Shirt, music: Music, tv: Tv,
  game: Gamepad2, book: Book, gift: Gift, dog: Dog, cat: Cat, sun: Sun, tree: TreePine,
  car: Car, bus: Bus, bike: Bike, shop: ShoppingCart,
} satisfies Record<string, LucideIcon>;

export type TileIconId = keyof typeof TILE_ICONS;

export function isTileIconId(value: unknown): value is TileIconId {
  return typeof value === 'string' && value in TILE_ICONS;
}
