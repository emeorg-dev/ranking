'use client';

import { Lock } from 'lucide-react';

import { RankingItem } from '@/components/ranking/ranking-item';
import type { RankedTeam, Round } from '@/lib/types';
import { cn } from '@/lib/utils';

const PODIUM = [
  { ring: 'ring-1 ring-primary/30', label: '1.°' },
  { ring: 'ring-1 ring-border', label: '2.°' },
  { ring: 'ring-1 ring-border', label: '3.°' },
];

interface RankingListProps {
  teams: RankedTeam[];
  activeRounds: Round[];
  revealed: boolean;
}

export function RankingList({ teams, activeRounds, revealed }: RankingListProps) {
  if (teams.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay equipos. Agrégalos en Ingreso de puntajes.
      </p>
    );
  }

  return (
    <div className="relative">
      {/* Lista con transición simultánea de blur+opacity */}
      <ol
        className={cn(
          'flex flex-col gap-2.5 transition-[filter,opacity] duration-300',
          !revealed && 'select-none blur-sm opacity-30'
        )}
      >
        {teams.map((team) => {
          const podiumIndex = team.rank - 1;
          const podium = podiumIndex >= 0 && podiumIndex < 3 ? PODIUM[podiumIndex] : null;

          return (
            <RankingItem
              key={team.id}
              rank={team.rank}
              name={team.name}
              total={team.total}
              scores={team.scores}
              activeRounds={activeRounds}
              isComplete={team.isComplete}
              pendingRounds={team.pendingRounds}
              isPodium={podium !== null}
              podiumLabel={podium?.label}
              podiumRing={podium?.ring}
            />
          );
        })}
      </ol>

      {/* Overlay único cuando el ranking está oculto */}
      {!revealed && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="flex items-center gap-2 rounded-lg border bg-background/90 px-4 py-3 shadow-sm">
            <Lock className="size-4" />
            <span className="text-sm font-medium">Ranking oculto</span>
          </div>
        </div>
      )}
    </div>
  );
}
