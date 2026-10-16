import type { LucideIcon } from 'lucide-react';
import { useState, type PointerEvent } from 'react';
import { TILE_COLOR_CLASS, type TileColorId } from '../data/colors';
import { FitText } from './FitText';

interface TileProps {
  label: string;
  color: TileColorId;
  icon?: LucideIcon;
  photo?: string;
  emoji?: string;
  variant?: 'word' | 'phrase';
  onClick?: () => void;
  /** Extra classes, e.g. a fixed size for the editor preview. */
  className?: string;
}

/** One board tile. Used by the grid and by the custom tile editor's preview, so both always match. */
export function Tile({ label, color, icon: Icon, photo, emoji, variant = 'word', onClick, className = '' }: TileProps) {
  const phrase = variant === 'phrase';
  // Where the last touch landed, for the ink ripple (hidden by CSS unless playful touches are on).
  const [ink, setInk] = useState<{ x: number; y: number; id: number } | null>(null);

  const startInk = (e: PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setInk({ x: e.clientX - rect.left, y: e.clientY - rect.top, id: Date.now() });
  };

  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={startInk}
      className={`pressable tile-edge relative flex min-w-0 flex-col items-center justify-center gap-[7px] overflow-hidden rounded-tile p-[7px] text-center leading-tight text-forest ${
        TILE_COLOR_CLASS[color]
      } ${phrase ? 'phrase-tile-label text-[15px] font-medium' : 'text-tile font-semibold'} ${className}`}
    >
      {photo ? (
        <img
          src={photo}
          alt=""
          className="aspect-square max-h-[58%] min-h-0 w-auto rounded-[9px] object-cover"
        />
      ) : emoji ? (
        <span className={`emoji shrink-0 leading-none ${phrase ? 'text-[22px] roomy:text-[28px]' : 'text-[36px] roomy:text-[48px]'}`} aria-hidden="true">
          {emoji}
        </span>
      ) : (
        Icon && <Icon size={phrase ? 20 : 32} strokeWidth={1.6} aria-hidden="true" className={`shrink-0 ${phrase ? 'tile-icon-sm' : 'tile-icon'}`} />
      )}
      <FitText className="line-clamp-2 max-w-full min-w-0">{label}</FitText>
      {ink && <span key={ink.id} className="ink" style={{ left: ink.x, top: ink.y }} aria-hidden="true" />}
    </button>
  );
}
