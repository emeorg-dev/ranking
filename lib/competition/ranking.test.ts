import { describe, expect,it } from 'vitest';

import type { CompetitionData, RankedTeam } from '../types';

import { assignRanks,calculateRanking } from './ranking';
import { sortRounds } from './rounds';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeData(
  teams: { id: string; name: string; order: number }[],
  rounds: { id: string; name: string; order: number }[],
  scores: { teamId: string; roundId: string; value: number | null }[]
): CompetitionData {
  return { name: 'Test', showName: true, teams, rounds, scores };
}

// ---------------------------------------------------------------------------
// calculateRanking
// ---------------------------------------------------------------------------

describe('calculateRanking', () => {
  it('suma correctamente dos rondas', () => {
    const data = makeData(
      [{ id: 't1', name: 'A', order: 1 }],
      [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      [
        { teamId: 't1', roundId: 'r1', value: 100 },
        { teamId: 't1', roundId: 'r2', value: 200 },
      ]
    );

    const result = calculateRanking(data, new Set(['r1', 'r2']));
    expect(result[0].total).toBe(300);
  });

  it('excluye rondas futuras del acumulado', () => {
    const data = makeData(
      [{ id: 't1', name: 'A', order: 1 }],
      [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
        { id: 'r3', name: 'R3', order: 3 },
      ],
      [
        { teamId: 't1', roundId: 'r1', value: 100 },
        { teamId: 't1', roundId: 'r2', value: 200 },
        { teamId: 't1', roundId: 'r3', value: 500 },
      ]
    );

    // Solo hasta ronda 2
    const result = calculateRanking(data, new Set(['r1', 'r2']));
    expect(result[0].total).toBe(300);
    expect(result[0].scores['r3']).toBeNull();
  });

  it('trata puntaje nulo como ronda pendiente', () => {
    const data = makeData(
      [{ id: 't1', name: 'A', order: 1 }],
      [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      [{ teamId: 't1', roundId: 'r1', value: 100 }]
      // r2 ausente → pendiente
    );

    const result = calculateRanking(data, new Set(['r1', 'r2']));
    expect(result[0].total).toBe(100);
    expect(result[0].pendingRounds).toBe(1);
    expect(result[0].isComplete).toBe(false);
    expect(result[0].scores['r2']).toBeNull();
  });

  it('puntaje cero es resultado válido, no pendiente', () => {
    const data = makeData(
      [{ id: 't1', name: 'A', order: 1 }],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [{ teamId: 't1', roundId: 'r1', value: 0 }]
    );

    const result = calculateRanking(data, new Set(['r1']));
    expect(result[0].total).toBe(0);
    expect(result[0].pendingRounds).toBe(0);
    expect(result[0].isComplete).toBe(true);
    expect(result[0].scores['r1']).toBe(0);
  });

  it('suma correctamente puntajes decimales', () => {
    const data = makeData(
      [{ id: 't1', name: 'A', order: 1 }],
      [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      [
        { teamId: 't1', roundId: 'r1', value: 50.5 },
        { teamId: 't1', roundId: 'r2', value: 25.25 },
      ]
    );

    const result = calculateRanking(data, new Set(['r1', 'r2']));
    expect(result[0].total).toBeCloseTo(75.75);
  });

  it('calcula totales y establece puntajes vacíos como null', () => {
    const data = makeData(
      [
        { id: 't1', name: 'Team A', order: 1 },
        { id: 't2', name: 'Team B', order: 2 },
      ],
      [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      [
        { teamId: 't1', roundId: 'r1', value: 10 },
        { teamId: 't1', roundId: 'r2', value: null },
        { teamId: 't2', roundId: 'r1', value: 5 },
        { teamId: 't2', roundId: 'r2', value: 15 },
      ]
    );

    const result = calculateRanking(data, new Set(['r1', 'r2']));
    expect(result[0].id).toBe('t2');
    expect(result[0].total).toBe(20);
    expect(result[1].id).toBe('t1');
    expect(result[1].total).toBe(10);
    expect(result[1].scores['r2']).toBeNull();
  });

  it('ignora rondas inactivas', () => {
    const data = makeData(
      [{ id: 't1', name: 'A', order: 1 }],
      [
        { id: 'r1', name: 'R1', order: 1 },
        { id: 'r2', name: 'R2', order: 2 },
      ],
      [
        { teamId: 't1', roundId: 'r1', value: 10 },
        { teamId: 't1', roundId: 'r2', value: 20 },
      ]
    );

    const result = calculateRanking(data, new Set(['r1']));
    expect(result[0].total).toBe(10);
    expect(result[0].scores['r2']).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// assignRanks
// ---------------------------------------------------------------------------

describe('assignRanks', () => {
  it('300, 250, 200 → 1, 2, 3', () => {
    const data = makeData(
      [
        { id: 't1', name: 'A', order: 1 },
        { id: 't2', name: 'B', order: 2 },
        { id: 't3', name: 'C', order: 3 },
      ],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [
        { teamId: 't1', roundId: 'r1', value: 300 },
        { teamId: 't2', roundId: 'r1', value: 250 },
        { teamId: 't3', roundId: 'r1', value: 200 },
      ]
    );
    const ranked = assignRanks(calculateRanking(data, new Set(['r1'])));
    expect(ranked.map((t: RankedTeam) => t.rank)).toEqual([1, 2, 3]);
  });

  it('300, 300, 250 → 1, 1, 3', () => {
    const data = makeData(
      [
        { id: 't1', name: 'A', order: 1 },
        { id: 't2', name: 'B', order: 2 },
        { id: 't3', name: 'C', order: 3 },
      ],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [
        { teamId: 't1', roundId: 'r1', value: 300 },
        { teamId: 't2', roundId: 'r1', value: 300 },
        { teamId: 't3', roundId: 'r1', value: 250 },
      ]
    );
    const ranked = assignRanks(calculateRanking(data, new Set(['r1'])));
    const t3 = ranked.find((t: RankedTeam) => t.id === 't3')!;
    expect(ranked.filter((t: RankedTeam) => t.total === 300).map((t: RankedTeam) => t.rank)).toEqual([1, 1]);
    expect(t3.rank).toBe(3);
  });

  it('300, 250, 250 → 1, 2, 2', () => {
    const data = makeData(
      [
        { id: 't1', name: 'A', order: 1 },
        { id: 't2', name: 'B', order: 2 },
        { id: 't3', name: 'C', order: 3 },
      ],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [
        { teamId: 't1', roundId: 'r1', value: 300 },
        { teamId: 't2', roundId: 'r1', value: 250 },
        { teamId: 't3', roundId: 'r1', value: 250 },
      ]
    );
    const ranked = assignRanks(calculateRanking(data, new Set(['r1'])));
    expect(ranked[0].rank).toBe(1);
    expect(ranked.filter((t: RankedTeam) => t.total === 250).map((t: RankedTeam) => t.rank)).toEqual([2, 2]);
  });

  it('300, 300, 300 → 1, 1, 1', () => {
    const data = makeData(
      [
        { id: 't1', name: 'A', order: 1 },
        { id: 't2', name: 'B', order: 2 },
        { id: 't3', name: 'C', order: 3 },
      ],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [
        { teamId: 't1', roundId: 'r1', value: 300 },
        { teamId: 't2', roundId: 'r1', value: 300 },
        { teamId: 't3', roundId: 'r1', value: 300 },
      ]
    );
    const ranked = assignRanks(calculateRanking(data, new Set(['r1'])));
    expect(ranked.map((t: RankedTeam) => t.rank)).toEqual([1, 1, 1]);
  });
});

// ---------------------------------------------------------------------------
// Orden de empates por team.order
// ---------------------------------------------------------------------------

describe('orden estable de empates por team.order', () => {
  it('equipos empatados se ordenan por team.order ascendente', () => {
    const data = makeData(
      [
        { id: 't1', name: 'Primero registrado', order: 1 },
        { id: 't2', name: 'Segundo registrado', order: 2 },
      ],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [
        { teamId: 't1', roundId: 'r1', value: 100 },
        { teamId: 't2', roundId: 'r1', value: 100 },
      ]
    );

    const result = calculateRanking(data, new Set(['r1']));
    expect(result[0].id).toBe('t1');
    expect(result[1].id).toBe('t2');
  });

  it('asigna rank 1 a ambos equipos empatados', () => {
    const data = makeData(
      [
        { id: 't1', name: 'A', order: 1 },
        { id: 't2', name: 'B', order: 2 },
      ],
      [{ id: 'r1', name: 'R1', order: 1 }],
      [
        { teamId: 't1', roundId: 'r1', value: 100 },
        { teamId: 't2', roundId: 'r1', value: 100 },
      ]
    );

    const ranked = assignRanks(calculateRanking(data, new Set(['r1'])));
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// sortRounds
// ---------------------------------------------------------------------------

describe('sortRounds', () => {
  it('ordena rondas desordenadas por order ascendente', () => {
    const rounds = [
      { id: 'r3', name: 'R3', order: 3 },
      { id: 'r1', name: 'R1', order: 1 },
      { id: 'r2', name: 'R2', order: 2 },
    ];
    const sorted = sortRounds(rounds);
    expect(sorted.map((r: { order: number }) => r.order)).toEqual([1, 2, 3]);
  });

  it('no muta el arreglo original', () => {
    const rounds = [
      { id: 'r3', name: 'R3', order: 3 },
      { id: 'r1', name: 'R1', order: 1 },
      { id: 'r2', name: 'R2', order: 2 },
    ];
    const original = [...rounds];
    sortRounds(rounds);
    expect(rounds).toEqual(original);
  });
});
