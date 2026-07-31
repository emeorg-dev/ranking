'use client';

import { RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { cn } from '@/lib/utils';

interface ScreenNavigationProps {
  currentScreen: 'entry' | 'ranking';
  onScreenChange: (screen: 'entry' | 'ranking') => void;
  onReset: () => void;
}

const TABS = [
  { id: 'entry' as const, label: 'Puntajes' },
  { id: 'ranking' as const, label: 'Ranking' },
];

export function ScreenNavigation({
  currentScreen,
  onScreenChange,
  onReset,
}: ScreenNavigationProps) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        {/* Segmented tabs */}
        <nav aria-label="Pantallas" className="flex items-center gap-1 rounded-lg bg-muted/60 p-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              aria-current={currentScreen === tab.id ? 'page' : undefined}
              onClick={() => onScreenChange(tab.id)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                currentScreen === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <p className="hidden items-center gap-1.5 text-xs text-muted-foreground lg:flex">
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>[</Kbd>
              <span className="opacity-50">/</span>
              <Kbd>]</Kbd>
            </KbdGroup>
            <span>cambiar pantalla</span>
            <span className="mx-1 opacity-30">·</span>
            <Kbd>R</Kbd>
            <span>mostrar ranking</span>
          </p>

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Reiniciar</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
