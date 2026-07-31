'use client';

import type { Round } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RankingItemProps {
  rank: number;
  name: string;
  total: number;
  scores: Record<string, number | null>;
  activeRounds: Round[];
  isComplete: boolean;
  pendingRounds: number;
  isPodium: boolean;
  podiumLabel?: string;
  podiumRing?: string;
}

export function RankingItem({
  rank,
  name,
  total,
  scores,
  activeRounds,
  isComplete,
  pendingRounds,
  isPodium,
  podiumLabel,
  podiumRing,
}: RankingItemProps) {
  return (
    <li
      className={cn(
        'relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5',
        podiumRing
      )}
    >
      <div className="flex items-center gap-4">
        {/* Posición */}
        <span
          className={cn(
            'flex size-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold tabular-nums',
            rank === 1 ? 'border-primary/40 text-foreground' : 'text-muted-foreground'
          )}
        >
          {rank}
        </span>

        {/* Equipo */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <p className="truncate font-medium">{name}</p>
            {isPodium && podiumLabel && (
              <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                {podiumLabel}
              </span>
            )}
          </div>
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {activeRounds.map((r) => (
              <span key={r.id} className="tabular-nums">
                {r.name}
                <span className="ml-1 font-medium text-foreground/80">
                  {scores[r.id] ?? '-'}
                </span>
              </span>
            ))}
          </div>
          {!isComplete && (
            <p className="mt-1 text-xs text-muted-foreground">
              {pendingRounds} resultado{pendingRounds !== 1 ? 's' : ''} pendiente
              {pendingRounds !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Total */}
        <div className="shrink-0 text-right">
          <div className="text-2xl font-semibold tabular-nums sm:text-3xl">{total}</div>
          <p className="text-[11px] text-muted-foreground">
            {activeRounds.length} ronda{activeRounds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </li>
  );
}
