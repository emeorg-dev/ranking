import { useCallback, useEffect, useRef } from 'react';

export function useRevealScroll() {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const targetScrollTopRef = useRef<number | null>(null);
  const lerpFactorRef = useRef(0.12);

  const getItemScrollOffset = useCallback(
    (el: HTMLElement, container: HTMLElement): number =>
      el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop,
    [],
  );

  const animate = useCallback(() => {
    const container = scrollContainerRef.current;
    const target = targetScrollTopRef.current;

    if (container !== null && target !== null) {
      const diff = target - container.scrollTop;

      if (Math.abs(diff) < 0.5) {
        container.scrollTop = target;
        targetScrollTopRef.current = null;
        animFrameRef.current = null;
        return;
      } else {
        container.scrollTop += diff * lerpFactorRef.current;
      }
    } else {
      animFrameRef.current = null;
      return;
    }

    animFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const animateTo = useCallback(
    (target: number, factor: number) => {
      targetScrollTopRef.current = target;
      lerpFactorRef.current = factor;

      if (animFrameRef.current === null) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    },
    [animate],
  );

  const stopAnimation = useCallback(() => {
    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, []);

  const resetScroll = useCallback(
    (animated: boolean = false) => {
      if (animated) {
        animateTo(0, 0.12);
      } else {
        targetScrollTopRef.current = null;
        stopAnimation();
        const container = scrollContainerRef.current;
        if (container) {
          container.scrollTop = 0;
        }
      }
    },
    [animateTo, stopAnimation],
  );

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
  }, []);

  useEffect(() => {
    return stopAnimation;
  }, [stopAnimation]);

  return {
    scrollContainerRef,
    itemRefs,
    getItemScrollOffset,
    animateTo,
    resetScroll,
    stopAnimation,
  };
}
