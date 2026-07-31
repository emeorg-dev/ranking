'use client';

import { forwardRef } from 'react';
import { Lock } from 'lucide-react';

import type { RankedTeam, Round } from '@/lib/types';
import { cn } from '@/lib/utils';

const PODIUM = [
  { ring: 'ring-1 ring-primary/30', label: '1.°' },
  { ring: 'ring-1 ring-border', label: '2.°' },
  { ring: 'ring-1 ring-border', label: '3.°' },
];

interface RankingItemProps {
  team: RankedTeam;
  activeRounds: Round[];
  isRevealed: boolean;
}

export const RankingItem = forwardRef<HTMLLIElement, RankingItemProps>(function RankingItem(
  { team, activeRounds, isRevealed },
  ref
) {
  const podiumIndex = team.rank - 1;
  const podium = podiumIndex >= 0 && podiumIndex < PODIUM.length ? PODIUM[podiumIndex] : null;

  return (
    <li
      ref={ref}
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5',
        'scroll-m-[20vh]',
        podium?.ring
      )}
    >
      {/* Overlay "Ranking oculto" — se desvanece al revelarse */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 z-10 flex items-center justify-center gap-2',
          'text-xs font-medium uppercase tracking-widest text-muted-foreground',
          'transition-opacity duration-500',
          isRevealed ? 'opacity-0' : 'opacity-100'
        )}
      >
        <Lock className="size-3.5" />
        Ranking oculto
      </div>

      {/* Contenido — aparece con blur + escala + opacidad al revelarse */}
      <div
        className={cn(
          'flex items-center gap-4',
          'transition-[filter,opacity,transform] duration-700',
          'ease-[cubic-bezier(0.22,1,0.36,1)]',
          isRevealed
            ? 'translate-y-0 scale-100 blur-0 opacity-100'
            : 'translate-y-3 scale-[0.99] select-none blur-md opacity-35'
        )}
      >
        {/* Posición */}
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums',
            team.rank === 1 ? 'border-primary/40 text-foreground' : 'text-muted-foreground'
          )}
        >
          {team.rank}
        </span>

        {/* Nombre y detalle de rondas */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="truncate font-medium">{team.name}</p>
            {podium && (
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                {podium.label}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {activeRounds.map((round) => (
              <span key={round.id} className="tabular-nums">
                {round.name}
                <span className="ml-1 font-medium text-foreground/80">
                  {team.scores[round.id] ?? '-'}
                </span>
              </span>
            ))}
          </div>
          {!team.isComplete && (
            <p className="mt-1 text-xs text-muted-foreground">
              {team.pendingRounds} resultado{team.pendingRounds !== 1 ? 's' : ''} pendiente
              {team.pendingRounds !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Total */}
        <div className="shrink-0 text-right">
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl">{team.total}</div>
          <p className="text-[11px] text-muted-foreground">
            {activeRounds.length} ronda{activeRounds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </li>
  );
});
