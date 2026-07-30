import { CompetitionData } from '@/lib/types';

export interface CompetitionStorage {
  load(): CompetitionData | null;
  save(data: CompetitionData): void;
  clear(): void;
}

export const localCompetitionStorage: CompetitionStorage = {
  load(): CompetitionData | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem('competition-data');
      if (stored) {
        return JSON.parse(stored) as CompetitionData;
      }
    } catch (error) {
      console.error('[Storage] Error loading competition data:', error);
    }
    return null;
  },

  save(data: CompetitionData): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('competition-data', JSON.stringify(data));
    } catch (error) {
      console.error('[Storage] Error saving competition data:', error);
    }
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem('competition-data');
    } catch (error) {
      console.error('[Storage] Error clearing competition data:', error);
    }
  },
};
