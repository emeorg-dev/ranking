'use client';

import { useCallback } from 'react';

import { getDemoData,getEmptyData } from '@/lib/competition/default-data';
import type { CompetitionData } from '@/lib/types';

export function useCompetition(
  data: CompetitionData,
  setData: React.Dispatch<React.SetStateAction<CompetitionData>>
) {
  const addTeam = useCallback(
    (name: string) => {
      setData((prev) => {
        const nextOrder =
          prev.teams.length > 0
            ? Math.max(...prev.teams.map((t) => t.order)) + 1
            : 1;

        return {
          ...prev,
          teams: [
            ...prev.teams,
            { id: crypto.randomUUID(), name, order: nextOrder },
          ],
        };
      });
    },
    [setData]
  );

  const removeTeam = useCallback(
    (teamId: string) => {
      setData((prev) => ({
        ...prev,
        teams: prev.teams.filter((t) => t.id !== teamId),
        scores: prev.scores.filter((s) => s.teamId !== teamId),
      }));
    },
    [setData]
  );

  const updateTeamName = useCallback(
    (teamId: string, name: string) => {
      setData((prev) => ({
        ...prev,
        teams: prev.teams.map((t) =>
          t.id === teamId ? { ...t, name } : t
        ),
      }));
    },
    [setData]
  );

  const addRound = useCallback(
    (name: string) => {
      setData((prev) => {
        const nextOrder =
          prev.rounds.length > 0
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
    },
    [setData]
  );

  const removeRound = useCallback(
    (roundId: string) => {
      setData((prev) => ({
        ...prev,
        rounds: prev.rounds.filter((r) => r.id !== roundId),
        scores: prev.scores.filter((s) => s.roundId !== roundId),
      }));
    },
    [setData]
  );

  const updateRoundName = useCallback(
    (roundId: string, name: string) => {
      setData((prev) => ({
        ...prev,
        rounds: prev.rounds.map((r) =>
          r.id === roundId ? { ...r, name } : r
        ),
      }));
    },
    [setData]
  );

  const setScore = useCallback(
    (teamId: string, roundId: string, value: number | null) => {
      setData((prev) => {
        // Remove the record when the value is cleared
        if (value === null) {
          return {
            ...prev,
            scores: prev.scores.filter(
              (s) => !(s.teamId === teamId && s.roundId === roundId)
            ),
          };
        }

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
    },
    [setData]
  );

  const updateCompetitionName = useCallback(
    (name: string) => {
      setData((prev) => ({ ...prev, name }));
    },
    [setData]
  );

  const toggleShowName = useCallback(
    (showName: boolean) => {
      setData((prev) => ({ ...prev, showName }));
    },
    [setData]
  );

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
    updateTeamName,
    addRound,
    removeRound,
    updateRoundName,
    setScore,
    updateCompetitionName,
    toggleShowName,
    reset,
    loadDemo,
  };
}
