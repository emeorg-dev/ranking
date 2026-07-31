import type { Round } from '@/lib/types';

/**
 * Returns a new array of rounds sorted by their `order` property ascending.
 * Does not mutate the original array.
 */
export function sortRounds(rounds: Round[]): Round[] {
  return [...rounds].sort((a, b) => a.order - b.order);
}
