import { describe, expect,it } from 'vitest';

import type { Score } from '../../types';
import { createScoreKey, createScoreMap, getScoreValue } from '../scores';

describe('createScoreKey', () => {
  it('genera clave con formato teamId:roundId', () => {
    expect(createScoreKey('t1', 'r1')).toBe('t1:r1');
  });
});

describe('createScoreMap', () => {
  const scores: Score[] = [
    { teamId: 't1', roundId: 'r1', value: 95 },
    { teamId: 't1', roundId: 'r2', value: 0 },
    { teamId: 't1', roundId: 'r3', value: null },
    { teamId: 't2', roundId: 'r1', value: 80 },
  ];

  it('obtiene puntaje existente', () => {
    const map = createScoreMap(scores);
    expect(getScoreValue(map, 't1', 'r1')).toBe(95);
  });

  it('obtiene puntaje cero', () => {
    const map = createScoreMap(scores);
    expect(getScoreValue(map, 't1', 'r2')).toBe(0);
  });

  it('obtiene null para puntaje explícitamente nulo', () => {
    const map = createScoreMap(scores);
    expect(getScoreValue(map, 't1', 'r3')).toBeNull();
  });

  it('devuelve null para combinación ausente', () => {
    const map = createScoreMap(scores);
    expect(getScoreValue(map, 't1', 'r99')).toBeNull();
  });

  it('distingue claves de equipos distintos en la misma ronda', () => {
    const map = createScoreMap(scores);
    expect(getScoreValue(map, 't1', 'r1')).toBe(95);
    expect(getScoreValue(map, 't2', 'r1')).toBe(80);
  });
});
