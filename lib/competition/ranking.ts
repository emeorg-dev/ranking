import { sortRounds } from '@/lib/competition/rounds';
import { createScoreMap, getScoreValue } from '@/lib/competition/scores';
import type { CompetitionData, RankedTeam } from '@/lib/types';

/**
 * Calculates the total scores for each team based on the provided active rounds.
 * Rounds are always processed in their defined `order`, regardless of array order.
 * Tracks pending rounds (null scores) per team.
 */
export function calculateRanking(
  data: CompetitionData,
  activeRoundIds: Set<string>
): Omit<RankedTeam, 'rank'>[] {
  const scoreMap = createScoreMap(data.scores);
  const orderedRounds = sortRounds(data.rounds);

  return data.teams
    .map((team) => {
      let total = 0;
      let pendingRounds = 0;
      const teamScores: Record<string, number | null> = {};

      for (const round of orderedRounds) {
        if (activeRoundIds.has(round.id)) {
          const value = getScoreValue(scoreMap, team.id, round.id);

          if (value !== null) {
            teamScores[round.id] = value;
            total += value;
          } else {
            teamScores[round.id] = null;
            pendingRounds += 1;
          }
        } else {
          teamScores[round.id] = null;
        }
      }

      return {
        ...team,
        scores: teamScores,
        total,
        pendingRounds,
        isComplete: pendingRounds === 0,
      };
    })
    .sort((a, b) => {
      // Primary: total descending
      if (b.total !== a.total) {
        return b.total - a.total;
      }
      // Secondary: team.order ascending (stable tie-breaking)
      return a.order - b.order;
    });
}

/**
 * Assigns explicit ranks to teams, handling ties properly (e.g. 1, 1, 3, 4).
 * Expects the input array to be sorted by total score descending.
 */
export function assignRanks(teams: Omit<RankedTeam, 'rank'>[]): RankedTeam[] {
  const rankedTeams: RankedTeam[] = [];

  for (let i = 0; i < teams.length; i++) {
    const currentTeam = teams[i];
    let rank = i + 1;

    if (i > 0 && currentTeam.total === rankedTeams[i - 1].total) {
      rank = rankedTeams[i - 1].rank;
    }

    rankedTeams.push({ ...currentTeam, rank });
  }

  return rankedTeams;
}
