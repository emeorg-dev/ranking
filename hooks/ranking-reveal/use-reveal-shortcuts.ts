import { useEffect } from 'react';

interface UseRevealShortcutsOptions {
  active: boolean;
  onToggleReveal: () => void;
  onToggleInstant: () => void;
}

export function useRevealShortcuts({
  active,
  onToggleReveal,
  onToggleInstant,
}: UseRevealShortcutsOptions) {
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

      if (event.key.toLowerCase() === 'z') {
        event.preventDefault();
        onToggleInstant();
        return;
      }

      if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        onToggleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onToggleReveal, onToggleInstant]);
}
