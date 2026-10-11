import type { LucideIcon } from 'lucide-react';
import { TILE_COLOR_CLASS, type TileColorId } from '../data/colors';

interface TileProps {
  label: string;
  color: TileColorId;
  icon?: LucideIcon;
  photo?: string;
  variant?: 'word' | 'phrase';
  onClick?: () => void;
  /** Extra classes, e.g. a fixed size for the editor preview. */
  className?: string;
}

/** One board tile. Used by the grid and by the custom tile editor's preview, so both always match. */
export function Tile({ label, color, icon: Icon, photo, variant = 'word', onClick, className = '' }: TileProps) {
  const phrase = variant === 'phrase';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`pressable tile-edge flex min-w-0 flex-col items-center justify-center gap-[7px] overflow-hidden rounded-tile p-[7px] text-center leading-tight text-forest ${
        TILE_COLOR_CLASS[color]
      } ${phrase ? 'text-[15px] font-medium' : 'text-tile font-semibold'} ${className}`}
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          className="aspect-square max-h-[58%] min-h-0 w-auto rounded-[9px] object-cover"
        />
      ) : (
        Icon && <Icon size={phrase ? 20 : 32} strokeWidth={1.6} aria-hidden="true" className="shrink-0" />
      )}
      <span className="line-clamp-2 break-words">{label}</span>
    </button>
  );
}
