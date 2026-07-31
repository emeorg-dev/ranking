'use client';

import { useEffect, useRef } from 'react';

/**
 * Desplaza horizontalmente el contenedor de la tabla de puntajes
 * cuando se agrega una nueva ronda.
 *
 * - Solo se desplaza cuando el número de rondas **aumenta** (no al cargar datos).
 * - El desplazamiento es inmediato (sin animación suave) para no interrumpir
 *   al usuario que está revisando rondas anteriores.
 */
export function useScoreTableScroll(
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
  roundsCount: number
) {
  const previousCountRef = useRef(roundsCount);

  useEffect(() => {
    const previousCount = previousCountRef.current;
    const roundWasAdded = roundsCount > previousCount;

    previousCountRef.current = roundsCount;

    if (!roundWasAdded) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollLeft = container.scrollWidth;
    });
  }, [roundsCount, scrollContainerRef]);
}
