import type { Score } from '@/lib/types';

/**
 * Creates a composite key for a team/round combination used in score maps.
 */
export function createScoreKey(teamId: string, roundId: string): string {
  return `${teamId}:${roundId}`;
}

/**
 * Builds an O(1) lookup map from a scores array.
 * Entries with `null` values are preserved so callers can distinguish
 * "no score entered" (absent key) from "score explicitly set to null".
 * After Tarea 4 (setScore cleanup), absent key == null score, but the map
 * still handles both cases safely.
 */
export function createScoreMap(scores: Score[]): Map<string, number | null> {
  return new Map(
    scores.map((score) => [createScoreKey(score.teamId, score.roundId), score.value])
  );
}

/**
 * Retrieves a score value from a pre-built score map.
 * Returns `null` if the combination does not exist.
 */
export function getScoreValue(
  scoreMap: Map<string, number | null>,
  teamId: string,
  roundId: string
): number | null {
  return scoreMap.get(createScoreKey(teamId, roundId)) ?? null;
}
