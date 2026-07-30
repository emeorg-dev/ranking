'use client';

import { useState, useEffect } from 'react';
import { localCompetitionStorage } from '@/lib/storage';
import { CompetitionData } from '@/lib/types';

export function useCompetitionStorage(initialValue: CompetitionData) {
  const [value, setValue] = useState<CompetitionData>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from storage after hydration
  useEffect(() => {
    const stored = localCompetitionStorage.load();
    if (stored) {
      setValue(stored);
    }
    setIsHydrated(true);
  }, []);

  // Save to storage whenever value changes
  useEffect(() => {
    if (isHydrated) {
      localCompetitionStorage.save(value);
    }
  }, [value, isHydrated]);

  return [value, setValue, isHydrated] as const;
}
