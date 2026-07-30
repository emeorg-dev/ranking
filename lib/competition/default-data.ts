import { CompetitionData } from '@/lib/types';

export function getEmptyData(name = 'Nueva Competencia'): CompetitionData {
  return {
    name,
    teams: [],
    rounds: [],
    scores: [],
  };
}

export function getDemoData(): CompetitionData {
  const t1 = 'team-1';
  const t2 = 'team-2';
  const t3 = 'team-3';
  const t4 = 'team-4';

  const r1 = 'round-1';
  const r2 = 'round-2';
  const r3 = 'round-3';
  const r4 = 'round-4';
  const r5 = 'round-5';

  return {
    name: 'Competencia de Demostración',
    teams: [
      { id: t1, name: 'Team Alpha' },
      { id: t2, name: 'Team Beta' },
      { id: t3, name: 'Team Gamma' },
      { id: t4, name: 'Team Delta' },
    ],
    rounds: [
      { id: r1, name: 'Ronda 1', order: 1 },
      { id: r2, name: 'Ronda 2', order: 2 },
      { id: r3, name: 'Ronda 3', order: 3 },
      { id: r4, name: 'Ronda 4', order: 4 },
      { id: r5, name: 'Ronda 5', order: 5 },
    ],
    scores: [
      // Round 1
      { teamId: t1, roundId: r1, value: 95 },
      { teamId: t2, roundId: r1, value: 87 },
      { teamId: t3, roundId: r1, value: 92 },
      { teamId: t4, roundId: r1, value: 89 },
      // Round 2
      { teamId: t1, roundId: r2, value: 88 },
      { teamId: t2, roundId: r2, value: 91 },
      { teamId: t3, roundId: r2, value: 85 },
      { teamId: t4, roundId: r2, value: 94 },
      // Round 3
      { teamId: t1, roundId: r3, value: 92 },
      { teamId: t2, roundId: r3, value: 86 },
      { teamId: t3, roundId: r3, value: 88 },
      { teamId: t4, roundId: r3, value: 91 },
      // Round 4
      { teamId: t1, roundId: r4, value: 89 },
      { teamId: t2, roundId: r4, value: 93 },
      { teamId: t3, roundId: r4, value: 91 },
      { teamId: t4, roundId: r4, value: 87 },
      // Round 5
      { teamId: t1, roundId: r5, value: 94 },
      { teamId: t2, roundId: r5, value: 88 },
      { teamId: t3, roundId: r5, value: 89 },
      { teamId: t4, roundId: r5, value: 92 },
    ],
  };
}
