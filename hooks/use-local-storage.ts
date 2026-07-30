'use client';

import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        setValue(JSON.parse(stored));
      }
    } catch (error) {
      console.error(`[v0] localStorage read error for ${key}:`, error);
    }
    setIsHydrated(true);
  }, [key]);

  // Save to localStorage whenever value changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`[v0] localStorage write error for ${key}:`, error);
      }
    }
  }, [value, isHydrated, key]);

  return [value, setValue, isHydrated] as const;
}
