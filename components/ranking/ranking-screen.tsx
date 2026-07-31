'use client';

import { useMemo } from 'react';

import { RankingHeader } from '@/components/ranking/ranking-header';
import { RankingList } from '@/components/ranking/ranking-list';
import { RoundSelector } from '@/components/ranking/round-selector';
import { ScrollArea } from '@/components/ui/scroll-area';
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

  const rankedTeams = useMemo(() => {
    const activeRoundIds = new Set(activeRounds.map((r) => r.id));
    return assignRanks(calculateRanking(data, activeRoundIds));
  }, [data, activeRounds]);

  // Reiniciar la animación al cambiar de ronda
  const selectedRoundId = activeRounds.at(-1)?.id ?? 'no-round';

  const reveal = useRankingReveal({
    active,
    itemCount: rankedTeams.length,
    resetKey: selectedRoundId,
  });

  const hasPendingScores = rankedTeams.some((team) => !team.isComplete);

  return (
    // El hook controla el scroll sobre el viewport interno del ScrollArea
    <ScrollArea
      viewportRef={reveal.scrollContainerRef}
      className="h-full"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <RankingHeader
          competitionName={data.name}
          showName={data.showName !== false}
          isRevealing={reveal.isRevealing}
          isPlaying={reveal.isPlaying}
          onToggleReveal={reveal.toggle}
          onToggleInstant={reveal.toggleInstant}
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

        <RankingList
          teams={rankedTeams}
          activeRounds={activeRounds}
          revealedCount={reveal.revealedCount}
          itemRefs={reveal.itemRefs}
        />
      </div>
    </ScrollArea>
  );
}
