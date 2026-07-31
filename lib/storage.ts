import { getEmptyData } from '@/lib/competition/default-data';
import { normalizeCompetitionData } from '@/lib/competition/normalize';
import type { CompetitionData } from '@/lib/types';

/**
 * Versioned storage wrapper. Bump STORAGE_VERSION when the CompetitionData
 * schema changes in a breaking way and add a migration branch in `load()`.
 */
interface StoredCompetition {
  version: number;
  data: CompetitionData;
}

const STORAGE_VERSION = 1;
const STORAGE_KEY = 'competition-data';

export interface CompetitionStorage {
  load(): CompetitionData | null;
  save(data: CompetitionData): void;
  clear(): void;
}

export const localCompetitionStorage: CompetitionStorage = {
  load(): CompetitionData | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;

      const parsed = JSON.parse(stored) as unknown;

      let rawData: CompetitionData;

      // Handle both the versioned format { version, data } and the legacy
      // flat CompetitionData format saved before versioning was introduced.
      if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'version' in (parsed as object) &&
        'data' in (parsed as object)
      ) {
        const versioned = parsed as StoredCompetition;
        rawData = versioned.data;
        // Future: add migration logic here based on versioned.version
      } else if (
        parsed !== null &&
        typeof parsed === 'object' &&
        'teams' in (parsed as object)
      ) {
        // Legacy flat format — treat as version 0
        rawData = parsed as CompetitionData;
      } else {
        console.warn('[Storage] Unrecognized data format, resetting.');
        return null;
      }

      // Validate that the core arrays are present
      if (!rawData || typeof rawData !== 'object') {
        console.warn('[Storage] Invalid data structure, resetting.');
        return getEmptyData();
      }

      return normalizeCompetitionData(rawData);
    } catch (error) {
      console.error('[Storage] Error loading competition data:', error);
      return null;
    }
  },

  save(data: CompetitionData): void {
    if (typeof window === 'undefined') return;
    try {
      const stored: StoredCompetition = { version: STORAGE_VERSION, data };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch (error) {
      console.error('[Storage] Error saving competition data:', error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('[Storage] Error clearing competition data:', error);
    }
  },
};
