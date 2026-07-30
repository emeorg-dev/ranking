'use client';

import { useState, useCallback } from 'react';
import { CompetitionData, Team, Score, TeamWithScores } from '@/lib/types';

const SAMPLE_DATA: CompetitionData = {
  teams: [
    { id: '1', name: 'Team Alpha' },
    { id: '2', name: 'Team Beta' },
    { id: '3', name: 'Team Gamma' },
    { id: '4', name: 'Team Delta' },
  ],
  scores: [
    // Round 1
    { teamId: '1', round: 1, score: 95 },
    { teamId: '2', round: 1, score: 87 },
    { teamId: '3', round: 1, score: 92 },
    { teamId: '4', round: 1, score: 89 },
    // Round 2
    { teamId: '1', round: 2, score: 88 },
    { teamId: '2', round: 2, score: 91 },
    { teamId: '3', round: 2, score: 85 },
    { teamId: '4', round: 2, score: 94 },
    // Round 3
    { teamId: '1', round: 3, score: 92 },
    { teamId: '2', round: 3, score: 86 },
    { teamId: '3', round: 3, score: 88 },
    { teamId: '4', round: 3, score: 91 },
    // Round 4
    { teamId: '1', round: 4, score: 89 },
    { teamId: '2', round: 4, score: 93 },
    { teamId: '3', round: 4, score: 91 },
    { teamId: '4', round: 4, score: 87 },
    // Round 5
    { teamId: '1', round: 5, score: 94 },
    { teamId: '2', round: 5, score: 88 },
    { teamId: '3', round: 5, score: 89 },
    { teamId: '4', round: 5, score: 92 },
  ],
};

export function useCompetition(initialData: CompetitionData) {
  const [data, setData] = useState<CompetitionData>(initialData);

  const addTeam = useCallback((name: string) => {
    setData((prev) => ({
      ...prev,
      teams: [
        ...prev.teams,
        { id: String(Date.now()), name },
      ],
    }));
  }, []);

  const removeTeam = useCallback((teamId: string) => {
    setData((prev) => ({
      ...prev,
      teams: prev.teams.filter((t) => t.id !== teamId),
      scores: prev.scores.filter((s) => s.teamId !== teamId),
    }));
  }, []);

  const setScore = useCallback((teamId: string, round: number, score: number) => {
    setData((prev) => {
      const existingIndex = prev.scores.findIndex(
        (s) => s.teamId === teamId && s.round === round
      );

      if (existingIndex >= 0) {
        const newScores = [...prev.scores];
        newScores[existingIndex] = { teamId, round, score };
        return { ...prev, scores: newScores };
      }

      return {
        ...prev,
        scores: [...prev.scores, { teamId, round, score }],
      };
    });
  }, []);

  const getMaxRound = useCallback(() => {
    return Math.max(...data.scores.map((s) => s.round), 0);
  }, [data.scores]);

  const getTeamScoresForRound = useCallback((teamId: string, round: number) => {
    return data.scores.find((s) => s.teamId === teamId && s.round === round)?.score ?? 0;
  }, [data.scores]);

  const getTeamsWithScores = useCallback((upToRound: number) => {
    return data.teams
      .map((team) => {
        const scores: number[] = [];
        let total = 0;

        for (let round = 1; round <= upToRound; round++) {
          const score = data.scores.find(
            (s) => s.teamId === team.id && s.round === round
          )?.score ?? 0;
          scores.push(score);
          total += score;
        }

        return { ...team, scores, total };
      })
      .sort((a, b) => b.total - a.total);
  }, [data.teams, data.scores]);

  const reset = useCallback(() => {
    setData(SAMPLE_DATA);
  }, []);

  return {
    data,
    setData,
    addTeam,
    removeTeam,
    setScore,
    getMaxRound,
    getTeamScoresForRound,
    getTeamsWithScores,
    reset,
  };
}

export function getInitialData(): CompetitionData {
  return SAMPLE_DATA;
}
