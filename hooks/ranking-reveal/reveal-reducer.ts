export type RevealMode = 'hidden' | 'sequential' | 'instant';

export interface RevealState {
  mode: RevealMode;
  revealedCount: number;
}

export type RevealAction =
  | { type: 'START_SEQUENCE' }
  | { type: 'REVEAL_FIRST' }
  | { type: 'REVEAL_NEXT'; itemCount: number }
  | { type: 'SHOW_INSTANT'; itemCount: number }
  | { type: 'FINISH'; itemCount: number }
  | { type: 'HIDE' };

export const initialRevealState: RevealState = {
  mode: 'hidden',
  revealedCount: 0,
};

export function revealReducer(
  state: RevealState,
  action: RevealAction
): RevealState {
  switch (action.type) {
    case 'START_SEQUENCE':
      return {
        mode: 'sequential',
        revealedCount: 0,
      };

    case 'REVEAL_FIRST':
      return {
        ...state,
        revealedCount: 1,
      };

    case 'REVEAL_NEXT':
      return {
        ...state,
        revealedCount: Math.min(state.revealedCount + 1, action.itemCount),
      };

    case 'SHOW_INSTANT':
    case 'FINISH':
      return {
        mode: 'instant',
        revealedCount: action.itemCount,
      };

    case 'HIDE':
      return initialRevealState;
  }
}
