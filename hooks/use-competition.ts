'use client';

import { useCallback } from 'react';
import { CompetitionData } from '@/lib/types';
import { getEmptyData, getDemoData } from '@/lib/competition/default-data';
import { calculateRanking, assignRanks } from '@/lib/competition/ranking';

export function useCompetition(
  data: CompetitionData,
  setData: React.Dispatch<React.SetStateAction<CompetitionData>>
) {
  const addTeam = useCallback((name: string) => {
    setData((prev) => ({
      ...prev,
      teams: [
        ...prev.teams,
        { id: crypto.randomUUID(), name },
      ],
    }));
  }, [setData]);

  const removeTeam = useCallback((teamId: string) => {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
      scores: prev.scores.filter((s) => s.teamId !== teamId),
    }));
  }, [setData]);

  const addRound = useCallback((name: string) => {
    setData((prev) => {
      const nextOrder = prev.rounds.length > 0
        ? Math.max(...prev.rounds.map((r) => r.order)) + 1
        : 1;
      return {
        ...prev,
        rounds: [
          ...prev.rounds,
          { id: crypto.randomUUID(), name, order: nextOrder },
        ],
      };
    });
  }, [setData]);

  const removeRound = useCallback((roundId: string) => {
    setData((prev) => ({
      ...prev,
      rounds: prev.rounds.filter((r) => r.id !== roundId),
      scores: prev.scores.filter((s) => s.roundId !== roundId),
    }));
  }, [setData]);

  const setScore = useCallback((teamId: string, roundId: string, value: number | null) => {
    setData((prev) => {
      const existingIndex = prev.scores.findIndex(
        (s) => s.teamId === teamId && s.roundId === roundId
      );

      if (existingIndex >= 0) {
        const newScores = [...prev.scores];
        newScores[existingIndex] = { teamId, roundId, value };
        return { ...prev, scores: newScores };
      }

      return {
        ...prev,
        scores: [...prev.scores, { teamId, roundId, value }],
      };
    });
  }, [setData]);

  const getRankedTeams = useCallback((activeRoundIds?: Set<string>) => {
    const ids = activeRoundIds ?? new Set(data.rounds.map((r) => r.id));
    return assignRanks(calculateRanking(data, ids));
  }, [data]);

  const reset = useCallback(() => {
    setData(getEmptyData());
  }, [setData]);

  const loadDemo = useCallback(() => {
    setData(getDemoData());
  }, [setData]);

  return {
    data,
    addTeam,
    removeTeam,
    addRound,
    removeRound,
    setScore,
    getRankedTeams,
    reset,
    loadDemo,
  };
}
