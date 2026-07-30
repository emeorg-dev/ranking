import { CompetitionData, RankedTeam, Team, Score, Round } from '@/lib/types';

/**
 * Calculates the total scores for each team based on the provided active rounds.
 */
export function calculateRanking(
  data: CompetitionData,
  activeRoundIds: Set<string>
): Omit<RankedTeam, 'rank'>[] {
  const scoreMap = new Map<string, number>();

  // Build an index of scores for O(1) lookup
  // Key: teamId:roundId -> value
  for (const score of data.scores) {
    if (score.value !== null) {
      scoreMap.set(`${score.teamId}:${score.roundId}`, score.value);
    }
  }

  return data.teams.map((team) => {
    let total = 0;
    const teamScores: Record<string, number | null> = {};

    for (const round of data.rounds) {
      if (activeRoundIds.has(round.id)) {
        const val = scoreMap.get(`${team.id}:${round.id}`);
        if (val !== undefined) {
          teamScores[round.id] = val;
          total += val;
        } else {
          teamScores[round.id] = null;
        }
      } else {
        teamScores[round.id] = null;
      }
    }

    return {
      ...team,
      scores: teamScores,
      total,
    };
  }).sort((a, b) => b.total - a.total);
}

/**
 * Assigns explicit ranks to teams, handling ties properly (e.g. 1, 1, 3, 4).
 * Expects the input array to be sorted by total score descending.
 */
export function assignRanks(
  teams: Omit<RankedTeam, 'rank'>[]
): RankedTeam[] {
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
