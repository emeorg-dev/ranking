'use client';

import { useMemo } from 'react';

import { RankingHeader } from '@/components/ranking/ranking-header';
import { RankingList } from '@/components/ranking/ranking-list';
import { RoundSelector } from '@/components/ranking/round-selector';
import { useRankingReveal } from '@/hooks/use-ranking-reveal';
import { useRankingRound } from '@/hooks/use-ranking-round';
import { assignRanks, calculateRanking } from '@/lib/competition/ranking';
import type { CompetitionData } from '@/lib/types';

interface RankingScreenProps {
  data: CompetitionData;
  active?: boolean;
}

export function RankingScreen({ data, active = true }: RankingScreenProps) {
  const { orderedRounds, activeRounds, selectedRoundIndex, selectRound } =
    useRankingRound(data);

  const { revealed, toggleReveal } = useRankingReveal(active);

  const rankedTeams = useMemo(() => {
    const activeRoundIds = new Set(activeRounds.map((r) => r.id));
    return assignRanks(calculateRanking(data, activeRoundIds));
  }, [data, activeRounds]);

  const hasPendingScores = rankedTeams.some((team) => !team.isComplete);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
      <RankingHeader
        competitionName={data.name}
        showName={data.showName !== false}
        revealed={revealed}
        onToggleReveal={toggleReveal}
      />

      <RoundSelector
        rounds={orderedRounds}
        selectedIndex={selectedRoundIndex}
        onSelect={selectRound}
      />

      {hasPendingScores && (
        <p className="mb-4 rounded-lg border border-dashed px-3 py-2 text-sm text-muted-foreground">
          ⚠ El ranking contiene equipos con puntajes pendientes.
        </p>
      )}

      <RankingList teams={rankedTeams} activeRounds={activeRounds} revealed={revealed} />
    </div>
  );
}
