'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';

import { initialRevealState, revealReducer } from './reveal-reducer';
import { getRevealDelay } from './reveal-timing';
import { useRevealScroll } from './use-reveal-scroll';
import { useRevealShortcuts } from './use-reveal-shortcuts';

interface UseRankingRevealOptions {
  active: boolean;
  itemCount: number;
  resetKey?: string;
  normalDelay?: number;
  thirdPlaceDelay?: number;
  secondPlaceDelay?: number;
  firstPlaceDelay?: number;
}

export function useRankingReveal({
  active,
  itemCount,
  resetKey,
  normalDelay,
  thirdPlaceDelay,
  secondPlaceDelay,
  firstPlaceDelay,
}: UseRankingRevealOptions) {
  const [state, dispatch] = useReducer(revealReducer, initialRevealState);

  const {
    scrollContainerRef,
    itemRefs,
    getItemScrollOffset,
    animateTo,
    resetScroll,
  } = useRevealScroll();

  const initialRevealTimeoutRef = useRef<number | null>(null);

  const clearInitialRevealTimeout = useCallback(() => {
    if (initialRevealTimeoutRef.current !== null) {
      window.clearTimeout(initialRevealTimeoutRef.current);
      initialRevealTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearInitialRevealTimeout;
  }, [clearInitialRevealTimeout]);

  const hideRanking = useCallback(() => {
    clearInitialRevealTimeout();
    dispatch({ type: 'HIDE' });
    resetScroll(true);
  }, [clearInitialRevealTimeout, resetScroll]);

  const showInstantly = useCallback(() => {
    clearInitialRevealTimeout();

    if (state.revealedCount === itemCount && itemCount > 0) {
      hideRanking();
    } else {
      dispatch({ type: 'SHOW_INSTANT', itemCount });
      resetScroll(true);
    }
  }, [clearInitialRevealTimeout, hideRanking, itemCount, resetScroll, state.revealedCount]);

  const startSequentialReveal = useCallback(() => {
    if (itemCount === 0) return;

    clearInitialRevealTimeout();
    dispatch({ type: 'START_SEQUENCE' });

    const container = scrollContainerRef.current;
    const lastItem = itemRefs.current[itemCount - 1];

    if (!container || !lastItem) {
      dispatch({ type: 'REVEAL_FIRST' });
      return;
    }

    const lastItemOffset = getItemScrollOffset(lastItem, container);
    const targetTop = Math.max(
      0,
      lastItemOffset - container.clientHeight + lastItem.offsetHeight + 32,
    );

    animateTo(targetTop, 0.12);

    initialRevealTimeoutRef.current = window.setTimeout(() => {
      dispatch({ type: 'REVEAL_FIRST' });
      initialRevealTimeoutRef.current = null;
    }, 600);
  }, [animateTo, clearInitialRevealTimeout, getItemScrollOffset, itemCount, itemRefs, scrollContainerRef]);

  const toggleSequential = useCallback(() => {
    if (state.mode !== 'hidden') {
      hideRanking();
    } else {
      startSequentialReveal();
    }
  }, [hideRanking, startSequentialReveal, state.mode]);

  useRevealShortcuts({
    active,
    onToggleReveal: toggleSequential,
    onToggleInstant: showInstantly,
  });

  useEffect(() => {
    hideRanking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (state.revealedCount === 0 || state.mode !== 'sequential') return;

    const currentIndex = itemCount - state.revealedCount;
    const item = itemRefs.current[currentIndex];
    const container = scrollContainerRef.current;

    if (!item || !container) return;

    const itemOffset = getItemScrollOffset(item, container);
    const itemCenter = itemOffset + item.offsetHeight / 2;
    const desired = itemCenter - container.clientHeight * 0.55;

    animateTo(Math.max(0, desired), 0.045);
  }, [animateTo, getItemScrollOffset, itemCount, itemRefs, scrollContainerRef, state.mode, state.revealedCount]);

  const revealNext = useCallback(() => {
    dispatch({ type: 'REVEAL_NEXT', itemCount });
  }, [itemCount]);

  useEffect(() => {
    if (state.mode !== 'sequential' || state.revealedCount === 0) return;

    if (state.revealedCount >= itemCount) {
      dispatch({ type: 'FINISH', itemCount });
      return;
    }

    const teamsRemaining = itemCount - state.revealedCount;
    const delay = getRevealDelay(teamsRemaining, {
      normalDelay,
      thirdPlaceDelay,
      secondPlaceDelay,
      firstPlaceDelay,
    });

    const id = window.setTimeout(revealNext, delay);
    return () => window.clearTimeout(id);
  }, [
    firstPlaceDelay,
    itemCount,
    normalDelay,
    revealNext,
    secondPlaceDelay,
    state.mode,
    state.revealedCount,
    thirdPlaceDelay,
  ]);

  return {
    scrollContainerRef,
    itemRefs,

    mode: state.mode,
    revealedCount: state.revealedCount,

    isHidden: state.mode === 'hidden',
    isPlaying: state.mode === 'sequential',
    isFullyVisible: state.mode === 'instant',

    startSequentialReveal,
    showInstantly,
    hideRanking,
  };
}
