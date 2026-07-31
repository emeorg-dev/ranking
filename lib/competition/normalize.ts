import type { CompetitionData } from '@/lib/types';

/**
 * Normalizes competition data loaded from storage to ensure it conforms to the
 * current schema. Handles older saved data that may be missing newer fields.
 *
 * - Adds `order` to teams that lack it, using their array index.
 * - Guarantees `teams`, `rounds`, and `scores` arrays exist.
 * - Preserves all other existing fields.
 */
export function normalizeCompetitionData(data: CompetitionData): CompetitionData {
  const teams = Array.isArray(data.teams) ? data.teams : [];
  const rounds = Array.isArray(data.rounds) ? data.rounds : [];
  const scores = Array.isArray(data.scores) ? data.scores : [];

  return {
    ...data,
    name: data.name ?? 'Nueva Competencia',
    teams: teams.map((team, index) => ({
      ...team,
      order: typeof team.order === 'number' ? team.order : index + 1,
    })),
    rounds,
    scores,
  };
}
