'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { sortRounds } from '@/lib/competition/rounds';
import type { CompetitionData, Round } from '@/lib/types';

/**
 * Gestiona la selección de rondas en el ranking.
 * - Ordena las rondas y filtra las que tienen al menos un puntaje registrado.
 * - Mantiene `selectedRoundIndex` sincronizado cuando se agregan o eliminan rondas.
 */
export function useRankingRound(data: CompetitionData) {
  const orderedRounds = useMemo<Round[]>(() => {
    const allRounds = sortRounds(data.rounds);
    return allRounds.filter((round) =>
      data.scores.some((score) => score.roundId === round.id && score.value !== null)
    );
  }, [data.rounds, data.scores]);

  const [selectedRoundIndex, setSelectedRoundIndex] = useState(() =>
    Math.max(0, orderedRounds.length - 1)
  );

  const previousCountRef = useRef(orderedRounds.length);

  useEffect(() => {
    const previousCount = previousCountRef.current;
    const previousLastIndex = Math.max(0, previousCount - 1);
    const newLastIndex = Math.max(0, orderedRounds.length - 1);

    setSelectedRoundIndex((currentIndex) => {
      const wasViewingLastRound = currentIndex === previousLastIndex;

      if (orderedRounds.length > previousCount && wasViewingLastRound) {
        // Se agregó una ronda y el usuario estaba en la última → avanzar a la nueva última
        return newLastIndex;
      }
      // Clamping al eliminar rondas
      return Math.min(currentIndex, newLastIndex);
    });

    previousCountRef.current = orderedRounds.length;
  }, [orderedRounds.length]);

  const activeRounds = orderedRounds.slice(0, selectedRoundIndex + 1);

  return {
    orderedRounds,
    activeRounds,
    selectedRoundIndex,
    selectRound: setSelectedRoundIndex,
  };
}
