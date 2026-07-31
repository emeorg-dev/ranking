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
 * Todo el movimiento del scroll usa únicamente `container.scrollTop` a través de un
 * bucle rAF. Nunca se mezcla con `scrollTo({ behavior: 'smooth' })`, que compite
 * con el lerp y puede hacer que el movimiento sea invisible.
 *
 * - Factor rápido (0.12): descenso inicial al último equipo.
 * - Factor lento (0.045): seguimiento suave durante la revelación.
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

  /** Ref al div con `overflow-y-auto`. RankingScreen lo adjunta en su JSX. */
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  /** Refs a cada `<li>` para calcular posiciones en tiempo real. */
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const animFrameRef = useRef<number | null>(null);

  /**
   * Destino de scroll actual.
   * null = el lerp no mueve el contenedor.
   */
  const targetScrollTopRef = useRef<number | null>(null);

  /**
   * Factor lerp activo.
   * - 0.12 durante el descenso inicial (rápido, llega al último equipo en ~0.5 s).
   * - 0.045 durante la revelación (suave, acompaña cada aparición).
   */
  const lerpFactorRef = useRef(0.12);

  const isRevealing = isPlaying || revealedCount > 0;

  // ---------------------------------------------------------------------------
  // Utilidad: posición absoluta de un elemento dentro del contenedor de scroll
  // ---------------------------------------------------------------------------

  /**
   * Calcula la posición vertical de `el` dentro del eje de scroll de `container`,
   * independientemente de cuántos ancestros posicionados haya en el medio.
   * Usa getBoundingClientRect() para obtener la posición visual real (considera transforms).
   */
  const getItemScrollOffset = useCallback(
    (el: HTMLElement, container: HTMLElement): number =>
      el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop,
    [],
  );

  // ---------------------------------------------------------------------------
  // Bucle lerp — única fuente de movimiento del scroll
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const animate = () => {
      const container = scrollContainerRef.current;
      const target = targetScrollTopRef.current;

      if (container !== null && target !== null) {
        const diff = target - container.scrollTop;

        if (Math.abs(diff) < 0.5) {
          container.scrollTop = target;
          targetScrollTopRef.current = null;
        } else {
          container.scrollTop += diff * lerpFactorRef.current;
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, []); // Solo monta/desmonta — el loop lee refs por lo que no necesita deps

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
  }, []); // Solo adjunta listeners al montar — el contenedor no cambia

  // ---------------------------------------------------------------------------
  // Actualizar objetivo de scroll cuando se revela un nuevo ítem
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (revealedCount === 0) return;

    const currentIndex = itemCount - revealedCount;
    const item = itemRefs.current[currentIndex];
    const container = scrollContainerRef.current;

    if (!item || !container) return;

    // Posición absoluta del centro del ítem dentro del contenedor de scroll
    const itemOffset = getItemScrollOffset(item, container);
    const itemCenter = itemOffset + item.offsetHeight / 2;

    // Colocar el ítem en el 55% de la altura visible (ligeramente bajo el centro)
    const desired = itemCenter - container.clientHeight * 0.55;

    lerpFactorRef.current = 0.045; // Factor suave para el seguimiento
    targetScrollTopRef.current = Math.max(0, desired);
  }, [getItemScrollOffset, itemCount, revealedCount]);

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
    targetScrollTopRef.current = null;

    const container = scrollContainerRef.current;
    if (container) {
      // Volver arriba con lerp rápido
      lerpFactorRef.current = 0.12;
      targetScrollTopRef.current = 0;
    }
  }, []);

  const start = useCallback(() => {
    if (itemCount === 0) return;

    setIsPlaying(true);
    setRevealedCount(0);

    const container = scrollContainerRef.current;
    const lastItem = itemRefs.current[itemCount - 1];

    if (!container || !lastItem) {
      setRevealedCount(1);
      return;
    }

    // Calcular la posición del último equipo dentro del contenedor de scroll.
    // Mostrar el ítem 32 px por encima del borde inferior del contenedor.
    const lastItemOffset = getItemScrollOffset(lastItem, container);
    const targetTop = Math.max(
      0,
      lastItemOffset - container.clientHeight + lastItem.offsetHeight + 32,
    );

    // Descender rápidamente hasta el último equipo usando el lerp (factor rápido).
    // No se usa scrollTo() para evitar que el navegador compita con el loop rAF.
    lerpFactorRef.current = 0.12;
    targetScrollTopRef.current = targetTop;

    // Esperar a que el lerp llegue al destino antes de comenzar la revelación.
    // Con factor 0.12 y distancias típicas de 200-800 px, 600 ms es suficiente.
    window.setTimeout(() => {
      setRevealedCount(1);
    }, 600);
  }, [getItemScrollOffset, itemCount]);

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
    // hide es estable (useCallback sin deps dinámicas); no incluirla evita el ciclo
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
