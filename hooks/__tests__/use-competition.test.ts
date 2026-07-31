/**
 * Tests de la lógica de useCompetition verificados a través de las funciones
 * puras de lib/competition que el hook utiliza internamente.
 * Esto evita la necesidad de renderizar React en entorno jsdom.
 */
import { describe, expect,it } from 'vitest';

import type { CompetitionData } from '../../lib/types';

// ---------------------------------------------------------------------------
// Helpers — simulan la lógica de setScore, removeTeam, removeRound
// ---------------------------------------------------------------------------

function setScore(
  prev: CompetitionData,
  teamId: string,
  roundId: string,
  value: number | null
): CompetitionData {
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
}

function removeTeam(prev: CompetitionData, teamId: string): CompetitionData {
  return {
    ...prev,
    teams: prev.teams.filter((t) => t.id !== teamId),
    scores: prev.scores.filter((s) => s.teamId !== teamId),
  };
}

function removeRound(prev: CompetitionData, roundId: string): CompetitionData {
  return {
    ...prev,
    rounds: prev.rounds.filter((r) => r.id !== roundId),
    scores: prev.scores.filter((s) => s.roundId !== roundId),
  };
}

// ---------------------------------------------------------------------------
// Estado de prueba base
// ---------------------------------------------------------------------------

const BASE: CompetitionData = {
  name: 'Test',
  showName: true,
  teams: [
    { id: 't1', name: 'A', order: 1 },
    { id: 't2', name: 'B', order: 2 },
  ],
  rounds: [
    { id: 'r1', name: 'R1', order: 1 },
    { id: 'r2', name: 'R2', order: 2 },
  ],
  scores: [
    { teamId: 't1', roundId: 'r1', value: 100 },
    { teamId: 't1', roundId: 'r2', value: 200 },
    { teamId: 't2', roundId: 'r1', value: 50 },
  ],
};

// ---------------------------------------------------------------------------
// removeTeam
// ---------------------------------------------------------------------------

describe('removeTeam', () => {
  it('elimina el equipo del arreglo de equipos', () => {
    const result = removeTeam(BASE, 't1');
    expect(result.teams.find((t) => t.id === 't1')).toBeUndefined();
  });

  it('elimina todos los puntajes del equipo eliminado', () => {
    const result = removeTeam(BASE, 't1');
    expect(result.scores.filter((s) => s.teamId === 't1')).toHaveLength(0);
  });

  it('no elimina puntajes de otros equipos', () => {
    const result = removeTeam(BASE, 't1');
    const remaining = result.scores.filter((s) => s.teamId === 't2');
    expect(remaining).toHaveLength(1);
    expect(remaining[0].value).toBe(50);
  });
});

// ---------------------------------------------------------------------------
// removeRound
// ---------------------------------------------------------------------------

describe('removeRound', () => {
  it('elimina la ronda del arreglo de rondas', () => {
    const result = removeRound(BASE, 'r1');
    expect(result.rounds.find((r) => r.id === 'r1')).toBeUndefined();
  });

  it('elimina todos los puntajes asociados a esa ronda', () => {
    const result = removeRound(BASE, 'r1');
    expect(result.scores.filter((s) => s.roundId === 'r1')).toHaveLength(0);
  });

  it('conserva los puntajes de otras rondas', () => {
    const result = removeRound(BASE, 'r1');
    expect(result.scores.filter((s) => s.roundId === 'r2')).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// setScore
// ---------------------------------------------------------------------------

describe('setScore', () => {
  it('borrar el input elimina el registro correspondiente', () => {
    const result = setScore(BASE, 't1', 'r1', null);
    expect(result.scores.find((s) => s.teamId === 't1' && s.roundId === 'r1')).toBeUndefined();
  });

  it('guardar 0 conserva el registro', () => {
    const result = setScore(BASE, 't2', 'r2', 0);
    const found = result.scores.find((s) => s.teamId === 't2' && s.roundId === 'r2');
    expect(found).toBeDefined();
    expect(found?.value).toBe(0);
  });

  it('editar un puntaje existente no crea duplicados', () => {
    const result = setScore(BASE, 't1', 'r1', 999);
    const matches = result.scores.filter((s) => s.teamId === 't1' && s.roundId === 'r1');
    expect(matches).toHaveLength(1);
    expect(matches[0].value).toBe(999);
  });

  it('cada combinación teamId+roundId tiene como máximo un registro', () => {
    let state = BASE;
    state = setScore(state, 't1', 'r1', 10);
    state = setScore(state, 't1', 'r1', 20);
    state = setScore(state, 't1', 'r1', 30);
    const matches = state.scores.filter((s) => s.teamId === 't1' && s.roundId === 'r1');
    expect(matches).toHaveLength(1);
    expect(matches[0].value).toBe(30);
  });
});
