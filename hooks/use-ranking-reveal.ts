'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseRankingRevealOptions {
  /** Si la pantalla de ranking está actualmente activa (controla el atajo R). */
  active: boolean;
  /** Número total de equipos en el ranking. */
  itemCount: number;
  /** Clave que reinicia la animación al cambiar. Usar el id de la última ronda activa. */
  resetKey?: string;
  /** Pausa entre equipos normales (ms). */
  normalDelay?: number;
  /** Pausa antes de revelar el 3.° lugar (ms). */
  thirdPlaceDelay?: number;
  /** Pausa antes de revelar el 2.° lugar (ms). */
  secondPlaceDelay?: number;
  /** Pausa antes de revelar el 1.° lugar (ms). */
  firstPlaceDelay?: number;
}

/**
 * Gestiona la revelación secuencial del ranking desde el último lugar hasta el primero.
 *
 * - Controla un bucle de animación lerp que desplaza `scrollContainerRef` (no `window`).
 * - Reinicia automáticamente cuando cambia `resetKey` (por ejemplo, al cambiar de ronda).
 * - Registra el atajo de teclado `R` mientras la pantalla está activa.
 */
export function useRankingReveal({
  active,
  itemCount,
  resetKey,
  normalDelay = 900,
  thirdPlaceDelay = 1500,
  secondPlaceDelay = 1900,
  firstPlaceDelay = 2600,
}: UseRankingRevealOptions) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  /** Ref al contenedor que tiene `overflow-y-auto`. RankingScreen lo adjunta aquí. */
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  /** Refs a cada `<li>` del ranking para calcular su posición. */
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const animationFrameRef = useRef<number | null>(null);
  const targetScrollTopRef = useRef<number | null>(null);

  const isRevealing = isPlaying || revealedCount > 0;

  // ---------------------------------------------------------------------------
  // Scroll lerp — bucle continuo que anima hacia targetScrollTopRef
  // ---------------------------------------------------------------------------

  const stopScrollAnimation = useCallback(() => {
    targetScrollTopRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);

  useEffect(() => {
    const animate = () => {
      const container = scrollContainerRef.current;
      const target = targetScrollTopRef.current;

      if (container && target !== null) {
        const diff = target - container.scrollTop;

        if (Math.abs(diff) < 0.5) {
          container.scrollTop = target;
          targetScrollTopRef.current = null;
        } else {
          container.scrollTop += diff * 0.035;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return stopScrollAnimation;
  }, [stopScrollAnimation]);

  // ---------------------------------------------------------------------------
  // Cancelar scroll automático si el usuario interactúa con rueda o touch
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cancel = () => {
      targetScrollTopRef.current = null;
    };

    container.addEventListener('wheel', cancel, { passive: true });
    container.addEventListener('touchstart', cancel, { passive: true });

    return () => {
      container.removeEventListener('wheel', cancel);
      container.removeEventListener('touchstart', cancel);
    };
  });

  // ---------------------------------------------------------------------------
  // Actualizar objetivo de scroll cuando se revela un nuevo ítem
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (revealedCount === 0) return;

    const currentIndex = itemCount - revealedCount;
    const item = itemRefs.current[currentIndex];
    const container = scrollContainerRef.current;

    if (!item || !container) return;

    // getBoundingClientRect() calcula la posición del ítem relativa al viewport.
    // Restando el top del contenedor y sumando scrollTop obtenemos la posición
    // exacta dentro del eje de scroll del contenedor, sin importar cuántos
    // elementos intermedios haya entre el <li> y el div con overflow-y-auto.
    const itemTop =
      item.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    const itemCenter = itemTop + item.offsetHeight / 2;
    const desiredTop = itemCenter - container.clientHeight * 0.55;

    targetScrollTopRef.current = Math.max(0, desiredTop);
  }, [itemCount, revealedCount]);

  // ---------------------------------------------------------------------------
  // Secuencia de revelación — avanza revealedCount con delays variables
  // ---------------------------------------------------------------------------

  const revealNext = useCallback(() => {
    setRevealedCount((current) => Math.min(current + 1, itemCount));
  }, [itemCount]);

  useEffect(() => {
    if (!isPlaying || revealedCount === 0) return;

    if (revealedCount >= itemCount) {
      setIsPlaying(false);
      return;
    }

    const teamsRemaining = itemCount - revealedCount;

    let delay = normalDelay;
    if (teamsRemaining === 3) delay = thirdPlaceDelay;
    else if (teamsRemaining === 2) delay = secondPlaceDelay;
    else if (teamsRemaining === 1) delay = firstPlaceDelay;

    const id = window.setTimeout(revealNext, delay);
    return () => window.clearTimeout(id);
  }, [
    firstPlaceDelay,
    isPlaying,
    itemCount,
    normalDelay,
    revealNext,
    revealedCount,
    secondPlaceDelay,
    thirdPlaceDelay,
  ]);

  // ---------------------------------------------------------------------------
  // Acciones públicas
  // ---------------------------------------------------------------------------

  const hide = useCallback(() => {
    setIsPlaying(false);
    setRevealedCount(0);
    stopScrollAnimation();

    const container = scrollContainerRef.current;
    if (container) container.scrollTop = 0;
  }, [stopScrollAnimation]);

  const start = useCallback(() => {
    if (itemCount === 0) return;

    setIsPlaying(true);
    setRevealedCount(0);

    const container = scrollContainerRef.current;
    const lastItem = itemRefs.current[itemCount - 1];

    if (!container || !lastItem) {
      // Sin referencias, revelar directamente el primer ítem
      setRevealedCount(1);
      return;
    }

    // Calcular la posición del último ítem dentro del contenedor de scroll.
    // Usamos getBoundingClientRect() para obtener la posición real en el viewport
    // y convertirla a coordenada absoluta dentro del eje de scroll del contenedor.
    const lastItemTop =
      lastItem.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop;

    const targetTop = lastItemTop - container.clientHeight + lastItem.offsetHeight + 32;

    container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });

    window.setTimeout(() => setRevealedCount(1), 700);
  }, [itemCount]);

  const toggle = useCallback(() => {
    if (isRevealing) {
      hide();
    } else {
      start();
    }
  }, [hide, isRevealing, start]);

  // ---------------------------------------------------------------------------
  // Reiniciar cuando cambia de ronda (resetKey)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    hide();
    // No incluir `hide` en deps para evitar ciclo — es estable (useCallback sin deps cambiantes)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  // ---------------------------------------------------------------------------
  // Atajo de teclado R
  // ---------------------------------------------------------------------------

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
        toggle();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, toggle]);

  return {
    scrollContainerRef,
    itemRefs,
    revealedCount,
    isPlaying,
    isRevealing,
    toggle,
    hide,
  };
}
