'use client';

import { useEffect } from 'react';

import { hasSystemModifierKey, isFormElementFocused } from '@/lib/dom-utils';

interface ShortcutHandlers {
  onGoToEntry?: () => void;
  onGoToRanking?: () => void;
}

/**
 * Orquesta los atajos de teclado globales.
 * Permite cambiar de pantalla rápidamente sin interferir cuando el foco está en inputs de texto.
 */
export function useShortcuts({
  onGoToEntry,
  onGoToRanking,
}: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Los atajos globales con Cmd/Ctrl se procesan primero, por lo que funcionan incluso
      // si un campo de formulario (input) tiene el foco. Esto permite navegación rápida.
      const isCtrlOrCmd = e.ctrlKey || e.metaKey;
      
      if (isCtrlOrCmd) {
        if (e.key === '[' || e.key === '{') {
          e.preventDefault();
          onGoToEntry?.();
          return;
        } else if (e.key === ']' || e.key === '}') {
          e.preventDefault();
          onGoToRanking?.();
          return;
        }
      }

      // 2. Comportamientos sin modificadores (si se necesitaran en un futuro, se agregarían aquí abajo)
      if (isFormElementFocused()) return;
      if (hasSystemModifierKey(e)) return;

      // Mapa de acciones sin modificador (ej: 'r' para reset)
      // const key = e.key.toLowerCase();
      // ...
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onGoToEntry, onGoToRanking]);
}
