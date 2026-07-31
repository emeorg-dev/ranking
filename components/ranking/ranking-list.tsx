'use client';

import type { MutableRefObject } from 'react';

import { RankingItem } from '@/components/ranking/ranking-item';
import type { RankedTeam, Round } from '@/lib/types';

interface RankingListProps {
  teams: RankedTeam[];
  activeRounds: Round[];
  /** Número de equipos revelados (desde el último lugar hacia el primero). */
  revealedCount: number;
  /** Refs a cada <li> para que el hook de scroll pueda calcular posiciones. */
  itemRefs: MutableRefObject<(HTMLLIElement | null)[]>;
}

export function RankingList({ teams, activeRounds, revealedCount, itemRefs }: RankingListProps) {
  if (teams.length === 0) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Todavía no hay equipos. Agrégalos en Ingreso de puntajes.
      </p>
    );
  }

  return (
    <ol className="flex flex-col gap-2.5">
      {teams.map((team, index) => {
        const isRevealed = index >= teams.length - revealedCount;

        return (
          <RankingItem
            key={team.id}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            team={team}
            activeRounds={activeRounds}
            isRevealed={isRevealed}
          />
        );
      })}
    </ol>
  );
}
