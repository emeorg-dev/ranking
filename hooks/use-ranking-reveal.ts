'use client';

import { useCallback, useEffect, useState } from 'react';

/**
 * Controla el estado de revelación del ranking.
 * - Expone `revealed` y `toggleReveal`.
 * - Registra el atajo de teclado `R` mientras la pantalla está activa.
 */
export function useRankingReveal(active: boolean) {
  const [revealed, setRevealed] = useState(false);

  const toggleReveal = useCallback(() => {
    setRevealed((current) => !current);
  }, []);

  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey
      ) {
        return;
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        toggleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, toggleReveal]);

  return { revealed, toggleReveal };
}
