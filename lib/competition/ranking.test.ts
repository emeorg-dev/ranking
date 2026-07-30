import { describe, it, expect } from 'vitest';
import { calculateRanking, assignRanks } from './ranking';
import { CompetitionData } from '../types';

describe('Ranking Logic', () => {
  it('calculates totals and sets empty scores to null', () => {
    const data: CompetitionData = {
      name: 'Test',
      teams: [
        { id: 't1', name: 'Team A' },
        { id: 't2', name: 'Team B' },
      ],
      rounds: [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      scores: [
        { teamId: 't1', roundId: 'r1', value: 10 },
        { teamId: 't1', roundId: 'r2', value: null }, // empty score
        { teamId: 't2', roundId: 'r1', value: 5 },
        { teamId: 't2', roundId: 'r2', value: 15 },
      ],
    };

    const activeRoundIds = new Set(['r1', 'r2']);
    const result = calculateRanking(data, activeRoundIds);

    // Sorted by total descending (Team B: 20, Team A: 10)
    expect(result[0].id).toBe('t2');
    expect(result[0].total).toBe(20);
    expect(result[1].id).toBe('t1');
    expect(result[1].total).toBe(10);
    expect(result[1].scores['r2']).toBeNull();
  });

  it('assigns ranks with ties properly (1, 1, 3)', () => {
    const data: CompetitionData = {
      name: 'Tie Test',
      teams: [
        { id: 't1', name: 'Team A' },
        { id: 't2', name: 'Team B' },
        { id: 't3', name: 'Team C' },
        { id: 't4', name: 'Team D' },
      ],
      rounds: [{ id: 'r1', name: 'R1', order: 1 }],
      scores: [
        { teamId: 't1', roundId: 'r1', value: 100 }, // rank 1
        { teamId: 't2', roundId: 'r1', value: 100 }, // rank 1
        { teamId: 't3', roundId: 'r1', value: 50 },  // rank 3
        { teamId: 't4', roundId: 'r1', value: 100 }, // rank 1
      ],
    };

    const activeRoundIds = new Set(['r1']);
    const calculated = calculateRanking(data, activeRoundIds);
    const ranked = assignRanks(calculated);

    // Ranked order: t1, t2, t4 (all 100), then t3 (50). The sort order within tie might vary but all should have rank 1
    const firstPlaceTeams = ranked.filter(t => t.total === 100);
    expect(firstPlaceTeams).toHaveLength(3);
    firstPlaceTeams.forEach(t => expect(t.rank).toBe(1));

    const thirdPlaceTeam = ranked.find(t => t.total === 50);
    expect(thirdPlaceTeam?.rank).toBe(4); // 4 teams, 3 tied for 1st, so next is 4th. Wait! 1, 1, 1, 4.
  });

  it('ignores inactive rounds', () => {
    const data: CompetitionData = {
      name: 'Active Rounds Test',
      teams: [
        { id: 't1', name: 'Team A' }
      ],
      rounds: [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      scores: [
        { teamId: 't1', roundId: 'r1', value: 10 },
        { teamId: 't1', roundId: 'r2', value: 20 },
      ],
    };

    const activeRoundIds = new Set(['r1']);
    const calculated = calculateRanking(data, activeRoundIds);
    
    expect(calculated[0].total).toBe(10);
    expect(calculated[0].scores['r2']).toBeNull();
  });
});
